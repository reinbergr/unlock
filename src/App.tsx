import './App.css';
import { useEffect, useState } from 'react';
import type { SelectboxOption } from './components/Selectbox/Selectbox';
import type { StrategyTestResult, TelegramProxyConfigType } from './types';
import { Main } from './components/Main/Main';

function App() {

  const strategyTestResultRestored = window.sessionStorage.getItem("strategyTestResult");
  
  const [bypassMethods, setBypassMethods] = useState<SelectboxOption[]>([]);
  const [ip, setIP] = useState<string>("");
  const [telergamProxyConfig, setTelegramProxyConfig] = useState<TelegramProxyConfigType | null>(null);
  const [strategyTestResult, setStrategyTestResult] = useState<StrategyTestResult>(strategyTestResultRestored ? JSON.parse(strategyTestResultRestored) : null);
  
  const onSelectChange = (method: string) => {
    setStrategyTestResult("requesting");
    window.ipcRenderer.send("bypassMethodChange", method);
  }

  const onStrategyTestResult = (event: Electron.IpcRendererEvent, result: StrategyTestResult) => {
    setStrategyTestResult(result);
    if (typeof result === "object") {
      window.sessionStorage.setItem("strategyTestResult", JSON.stringify(result));
    }
  }

  useEffect(() => {
    window.ipcRenderer.send("getIP", {});
    window.ipcRenderer.send("getTelegramProxyConfig", {});
    window.ipcRenderer.send("getBypassMethods", {});
    window.ipcRenderer.on("ip", (event, ip) => setIP(ip));
    window.ipcRenderer.on("telegramProxyConfig", (event, config) => setTelegramProxyConfig(config));
    window.ipcRenderer.on("bypassMethods", (event, methods: string[]) => setBypassMethods(methods.map(method => ({name: method, value: method}))));
    window.ipcRenderer.on("strategyTestResult", onStrategyTestResult);
  }, []);

  return <Main ip={ip}
    strategyTestResult={strategyTestResult}
    bypassMethods={bypassMethods}
    onSelectChange={onSelectChange}
    telergamProxyConfig={telergamProxyConfig} />
}

export default App
