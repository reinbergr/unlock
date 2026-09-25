
import styles from "./Main.module.scss";
import Selectbox, { SelectboxOption } from "../Selectbox/Selectbox";
import { QRCodeSVG } from "qrcode.react";
import { TelegramProxyConfigType } from "../../types";

const appName = "UNLOCK";
const appVer = "";

export interface MainProps {
  ip: string;
  bypassMethods: SelectboxOption[];
  onSelectChange: (method: string) => void;
  telergamProxyConfig: TelegramProxyConfigType | null;
}

export const Main: React.FC<MainProps> = ({ip, bypassMethods, onSelectChange, telergamProxyConfig}) => {
  return (
    <div className={styles.mainWrapper}>
      <header className={styles.header}>
        {appName}
      </header>
      <br></br>
      <br></br>
      <div className={styles.items}>
        <div className={styles.item}>
          <div>⚠️Выберите стратегию обхода DPI</div>
          <div style={{fontWeight: "700", marginBottom: "5px"}}>⚠️Если Youtube не заработает выберите другую</div>
          <Selectbox text="Стратегия обхода" options={bypassMethods} onSelectChange={onSelectChange} />
        </div>
        <div className={styles.item}>
          <div>
            <div className={styles.itemTitle}>Telegram на IOS/Android</div>
            <div style={{marginBottom: "10px"}}>Чтобы Telegram заработал на вашем телефоне просто отсканируйте QR-code:</div>
            {telergamProxyConfig && ip && <QRCodeSVG size={256} value={`tg://proxy?server=${ip}&port=${telergamProxyConfig.port}&secret=dd${telergamProxyConfig.secret}`} />}
            <div>
              <div>Или настройте вручную:</div>
              <div>Настройки → Прокси → Добавить прокси → MTProto</div>
              <div style={{fontWeight: "500"}}>📦Сервер: {ip}</div>
              <div style={{fontWeight: "500"}}>📦Порт: {telergamProxyConfig && telergamProxyConfig.port}</div>
              <div style={{fontWeight: "500"}}>🔑Ключ: dd{telergamProxyConfig && telergamProxyConfig.secret}</div>
            </div>
          </div>
          <div style={{marginTop: "50px"}}>
            <div className={styles.itemTitle}>Youtube на IOS/Android</div>
            <div>Чтобы Youtube заработал на вашем телефоне настройте прокси вашей WIFI-сети:</div>
            <div style={{fontWeight: "500"}}>📦Сервер: {ip}</div>
            <div style={{fontWeight: "500"}}>📦Порт: 8124</div>
          </div>
        </div>
      </div>
    </div>
  )
}