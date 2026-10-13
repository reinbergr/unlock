
import type {TelegramProxyConfigType} from '../src/types';
import {NETERRORS, YT, Discord, ResultType, strategyTest} from '../src/utils/strategyTest';
import {app, ipcMain, BrowserWindow, Tray, Menu, dialog} from 'electron';
import {psList} from "@heyikang/ps-list";
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {ChildProcess, exec, spawn} from "node:child_process";
import path from 'node:path';
import util from "node:util";
import fs from "node:fs";
import ip from "ip";
import appdataPath from 'appdata-path';
import chokidar from "chokidar";

const execute = util.promisify(exec);

const isDevelopment = import.meta.env.MODE === "development";
const require = createRequire(import.meta.url);
const dirname = path.dirname(fileURLToPath(import.meta.url));

const telegramProxyConfig: TelegramProxyConfigType = {
  "port": 1443,
  "host": "0.0.0.0",
  "dc_ip": ["2:149.154.167.220", "4:149.154.167.220"],
  "verbose": false,
  "check_updates": false,
  "log_max_mb": 1,
  "buf_kb": 256,
  "pool_size": 4,
  "cfproxy": true,
  "cfproxy_user_domain_enabled": false,
  "cfproxy_user_domain": [],
  "cfproxy_worker_enabled": false,
  "cfproxy_worker_domain": [],
  "force_test_dc": false,
  "secret": "9e7d1f428c4f8f3d5c6e8f3a1c8f6e9e",
  "language": "ru",
  "autostart": false
}

const createConfigForTelegramProxy = () => {
  const configDir = path.join(appdataPath(), "TgWsProxy");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, {recursive: true});
    fs.writeFileSync(path.join(configDir, "config.json"), JSON.stringify(telegramProxyConfig));
  }
}

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(dirname, '..');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

const RESOURCES_PARENT_DIR = isDevelopment ? process.env.APP_ROOT : process.resourcesPath;
const ZAPRET_DIR = path.join(RESOURCES_PARENT_DIR, "resources/lib/zapret");
const FORWARD_PROXY_DIR = path.join(RESOURCES_PARENT_DIR, "resources/lib/forward-proxy/index.js");
const TG_PROXY_DIR = path.join(RESOURCES_PARENT_DIR, "resources/exe/TgWsProxy_windows.exe");
const FASTLIST_X86_DIR = path.join(RESOURCES_PARENT_DIR, "resources/exe/fastlist-0.3.0-x86.exe");
const FASTLIST_X64_DIR = path.join(RESOURCES_PARENT_DIR, "resources/exe/fastlist-0.3.0-x64.exe");
const UNLOCK_BAT_DIR = path.join(RESOURCES_PARENT_DIR, "resources/bat/unlock.bat");
const ADMIN_CHECK_DIR = path.join(RESOURCES_PARENT_DIR, "resources/bat/temp/admin.check");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let observeStrategyIntervalID: NodeJS.Timeout;
let mainWindow: BrowserWindow | null;
let tray: Tray | null;
let forwardProxyProcess: ChildProcess;
let isQuitting = false;

const terminateProcessByNameWMIC = (processName: string) => {
  exec(`wmic process where name="${processName}" delete`, err => err && console.log("WMIC", err));
}
const stopServiceByNameWMIC = (serviceName: string) => {
  exec(`wmic service where name="${serviceName}" call StopService`, err => err && console.log("WMIC", err));
}

const analyseStrategyTest = (tests: ResultType[]) => {
  const {ABORTERROR, OTHERERROR} = NETERRORS;
  const fails = {
    youtube: false,
    discord: false
  };
  const checkFail = (test: ResultType, service: typeof Discord | typeof YT) => {
    const {host, status} = test;
    for (const serviceKey of Object.keys(service)) if (host === service[serviceKey as keyof typeof service] && (status === ABORTERROR || status === OTHERERROR)) return true;
  }
  for (let i = 0; i < tests.length; i++) {
    if (checkFail(tests[i], YT)) { fails.youtube = true }
    if (checkFail(tests[i], Discord)) { fails.discord = true }
  }
  return fails;
}

const endObservation = (startTime: [number, number], diff: number) => process.hrtime(startTime)[0] >= diff;

const observeStrategyChange = async () => {
  let prevStrategy: string | undefined = undefined;
  let isUnset = false;
  const startTime = process.hrtime();
  clearInterval(observeStrategyIntervalID);
  observeStrategyIntervalID = setInterval(async () => {
    try {
      const {stdout, stderr} = await execute("@chcp 65001 > nul & reg query \"HKLM\\System\\CurrentControlSet\\Services\\unlock\" /v Strategy");
      const result = /Strategy\s+REG_SZ\s+(.*?)\s*$/i.exec(stdout);
      if (result) {
        const strategy = result[1];
        if (!prevStrategy) prevStrategy = strategy;
        if (prevStrategy !== strategy || isUnset) {
          clearInterval(observeStrategyIntervalID);
          const test = await strategyTest();
          const strategyTestResult = analyseStrategyTest(test);
          return mainWindow?.webContents.send('strategyTestResult', strategyTestResult);
        }
      }
      if (endObservation(startTime, 30)) clearInterval(observeStrategyIntervalID);
    } catch (error) {
      if (!isUnset) isUnset = true;
      // ERROR: The system was unable to find the specified registry key or value.
      if (endObservation(startTime, 30)) clearInterval(observeStrategyIntervalID);
    }
  }, 500);
}

const onBeforeQuit = () => {}

const onUnlockAppClose = () => {
  isQuitting = true;
  const child = forwardProxyProcess;
  if (child) {
    child.removeAllListeners();
    child.stderr?.destroy();
    child.stdout?.destroy();
    child.stdin?.destroy();
    child.kill();
  }
  // terminates:
  // winws.exe
  // TgWsProxy_windows.exe
  // WinDivert/WinDivert14/unlock services
  exec(`${UNLOCK_BAT_DIR} endService`, (error, stdout, stderr) => app.quit());
}

function createTray() {
  tray = new Tray(path.join(process.env.VITE_PUBLIC, 'app-icon.png'));
  const openMainWindow = () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  }
  const menu = Menu.buildFromTemplate([
    {label: "Открыть Unlock", click: () => { openMainWindow() }},
    {type: "separator"},
    {label: "Закрыть Unlock", click: () => { onUnlockAppClose() }}
  ]);
  tray.setContextMenu(menu);
  tray.setToolTip("Unlock");
  tray.on("click", (event: Electron.KeyboardEvent) => openMainWindow());
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1250,
    height: 750,
    backgroundColor: "black",
    icon: path.join(process.env.VITE_PUBLIC, 'app-icon.png'),
    webPreferences: {
      preload: path.join(dirname, 'preload.mjs'),
    },
  });

  mainWindow.on("close", event => {
    if (!isQuitting) {
      event.preventDefault();
      (mainWindow as BrowserWindow).hide();
      if (process.platform === "win32") {
        if (tray) {
          tray.displayBalloon({
            title: "Unlock работает в фоне",
            content: "Нажмите на иконку в трее чтобы открыть.",
            icon: path.join(process.env.VITE_PUBLIC, 'app-icon.png')
          });
        }
      }
    }
  });

  // Test active push message to Renderer-process
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('main-process-message', (new Date).toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
}

app.on("before-quit", () => onBeforeQuit());
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== "darwin") {
    app.quit();
    mainWindow = tray = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

ipcMain.on("bypassMethodChange", async (event, method: string) => {
  // eslint-disable-next-line prefer-const
  let timerId: NodeJS.Timeout;
  if (!fs.existsSync(ADMIN_CHECK_DIR)) {
    fs.writeFileSync(ADMIN_CHECK_DIR, "");
  }
  const watcher = chokidar.watch(ADMIN_CHECK_DIR);
  const closeWatcher = () => watcher.close();
  const errorWatcher = (error: unknown) => {
    console.log(error);
    closeWatcher();
  }
  // if user granted admin-request batscript will remove admin.check
  const unlinkWatcher = (path: string) => {
    clearTimeout(timerId);
    closeWatcher();
    observeStrategyChange();
    mainWindow?.webContents.send('strategyTestResult', "installing");
  }
  watcher.on("error", errorWatcher).on("unlink", unlinkWatcher);

  const {stdout, stderr} = await execute(`${UNLOCK_BAT_DIR} setService "${method}.bat"`);
  
  timerId = setTimeout(() => {
    closeWatcher();
    mainWindow?.webContents.send('strategyTestResult', null);
    dialog.showMessageBox(mainWindow as BrowserWindow, {
      title: "Unlock.exe",
      message: "Разрешите Unlock вносить изменения для установки стратегии",
      type: "error",
      buttons: ["OK"],
    });
  }, 4000);
});

ipcMain.on("getBypassMethods", () => {
  try {
    const bypassMethods = fs.readdirSync(ZAPRET_DIR);
    const omitList = ["bin", "utils", "lists"];
    const bypassMethodsPrepared = bypassMethods.filter((value) => !omitList.includes(value)).map(value => value.slice(0, -4));
    mainWindow?.webContents.send('bypassMethods', bypassMethodsPrepared);
  }
  catch(fsError) {
    console.log("getBypassMethods", fsError);
  }
});

ipcMain.on("getIP", () => {
  const ipAddr = ip.address();
  mainWindow?.webContents.send('ip', ipAddr);
});

ipcMain.on("getTelegramProxyConfig", () => {
  mainWindow?.webContents.send('telegramProxyConfig', telegramProxyConfig);
});

const initForwardProxy = () => {
  forwardProxyProcess = spawn("node", [FORWARD_PROXY_DIR], {stdio: "pipe", env: {ELECTRON_RUN_AS_NODE: '1', APP_ROOT: process.env.APP_ROOT, VITE_PUBLIC: process.env.VITE_PUBLIC}});
  forwardProxyProcess.stdout?.on('data', (data: Buffer) => console.log(data.toString()));
  forwardProxyProcess.stderr?.on('data', (data: Buffer) => console.log(data.toString()));
  forwardProxyProcess.on("close", code => console.log("Forward proxy terminated in child process", code));
}

const initTelegramProxy = async () => {
  const processes = await psList({
    // github.com/heyikang/ps-list
    pslistIa32Path: FASTLIST_X86_DIR,
    pslistX64Path: FASTLIST_X64_DIR
  });
  for(let p = 0; p < processes.length; p++) {
    const process = processes[p];
    if (process.name.startsWith("TgWsProxy")) {
      return undefined;
    }
  }
  createConfigForTelegramProxy();
  exec(TG_PROXY_DIR, (error, stdout, stderr) => {});
}

app.whenReady().then(() => {
  initForwardProxy();
  initTelegramProxy();
  createTray();
  createMainWindow();
});