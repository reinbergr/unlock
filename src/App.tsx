import './App.css';
import { useEffect, useState } from 'react';
import type { SelectboxOption } from './components/Selectbox/Selectbox';
import type { TelegramProxyConfigType } from './types';
import { Main } from './components/Main/Main';

function App() {
  const [bypassMethods, setBypassMethods] = useState<SelectboxOption[]>([]);
  const [ip, setIP] = useState<string>("");
  const [telergamProxyConfig, setTelegramProxyConfig] = useState<TelegramProxyConfigType | null>(null);
  
  const onSelectChange = (method: string) => {
    window.ipcRenderer.send("bypassMethodChange", method);
  }

  useEffect(() => {
    window.ipcRenderer.send("getIP", {});
    window.ipcRenderer.send("getTelegramProxyConfig", {});
    window.ipcRenderer.send("getBypassMethods", {});
    window.ipcRenderer.on("ip", (event, ip) => setIP(ip));
    window.ipcRenderer.on("telegramProxyConfig", (event, config) => setTelegramProxyConfig(config));
    window.ipcRenderer.on("bypassMethods", (event, methods: string[]) => setBypassMethods(methods.map(method => ({name: method, value: method}))));
  }, []);

  return <Main ip={ip} bypassMethods={bypassMethods} onSelectChange={onSelectChange} telergamProxyConfig={telergamProxyConfig} />
}

export default App
