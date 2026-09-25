
import type {TelegramProxyConfigType} from '../src/types';
import {app, ipcMain, BrowserWindow, Tray, Menu} from 'electron';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {psList} from "@heyikang/ps-list";
import {ChildProcess, exec, spawn} from "node:child_process";
import path from 'node:path';
import fs from "node:fs";
import ip from "ip";
import appdataPath from 'appdata-path';

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

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let mainWindow: BrowserWindow | null;
let tray: Tray | null;
let forwardProxyProcess: ChildProcess;
let isQuitting = false;

const terminateProcessByNameWMIC = (processName: string) => {
  exec(`wmic process where name='${processName}' delete`, err => err && console.log("WMIC", err));
}

const terminateChildProcess = () => {
  const child = forwardProxyProcess;
  if (child) {
    child.removeAllListeners();
    child.stderr?.destroy();
    child.stdout?.destroy();
    child.stdin?.destroy();
    child.kill();
  }
  terminateProcessByNameWMIC("TgWsProxy_windows.exe");
  terminateProcessByNameWMIC("winws.exe");
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
    {label: "Закрыть Unlock", click: () => { isQuitting = true; app.quit() }}
  ]);
  tray.setContextMenu(menu);
  tray.setToolTip("Unlock");
  tray.on("click", (event: Electron.KeyboardEvent) => openMainWindow());
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1150,
    height: 800,
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

app.on("before-quit", () => terminateChildProcess());
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

ipcMain.on("bypassMethodChange", (event, method: string) => {
  try {
    // close previous winws.exe using wmic (taskkill usage to kill winws.exe throws EPERM-error)
    terminateProcessByNameWMIC("winws.exe");
    exec(`${ZAPRET_DIR}"/${method}"`);
  }
  catch (error) {
    console.log("bypassMethodChange", error);
  }
});

ipcMain.on("getBypassMethods", () => {
  try {
    const bypassMethods = fs.readdirSync(ZAPRET_DIR);
    const omitList = ["bin", "utils", "lists"];
    const bypassMethodsPrepared = bypassMethods.filter((value) => !omitList.includes(value));
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