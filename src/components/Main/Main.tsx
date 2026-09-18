
import styles from "./Main.module.scss";
import Selectbox, { SelectboxOption } from "../Selectbox/Selectbox";
import { QRCodeSVG } from "qrcode.react";
import { TelegramProxyConfigType } from "../../types";

const appName = "UNLOCK";
const appVer = "unlock your favorite apps";
const appIcon = "https://play-lh.googleusercontent.com/_hTXWITjPuY_g6Z_XAhyfTQRuwJ7fACyNCUU0tW1Zp-AhNCAzs5EzIdMC74aDI8vlA";
const iosInstruction = "https://yandex.ru/video/preview/10550085951459610414";
const androidInstruction = "https://yandex.ru/video/preview/13682703419194943455";

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
          <div className={styles.itemTitle}>DPI</div>
          <div>⚠️Выберите стратегию обхода DPI</div>
          <div style={{fontWeight: "700", marginBottom: "5px"}}>⚠️Если Youtube не заработает выберите другую</div>
          <Selectbox text="Стратегия обхода" options={bypassMethods} onSelectChange={onSelectChange} />
        </div>
        <div className={styles.item}>
          <div>
            <div className={styles.itemTitle}>Telegram на телефоне</div>
            <div style={{marginBottom: "10px"}}>Чтобы Telegram заработал на вашем телефоне просто отсканируйте QR-code:</div>
            {telergamProxyConfig && ip && <QRCodeSVG size={356} value={`tg://proxy?server=${ip}&port=${telergamProxyConfig.port}&secret=dd${telergamProxyConfig.secret}`} />}
            <div>
              <div>Или настройте вручную:</div>
              <div>Настройки → Прокси → Добавить прокси → MTProto</div>
              <div style={{fontWeight: "500"}}>🔧Сервер: {ip}</div>
              <div style={{fontWeight: "500"}}>🔧Порт: {telergamProxyConfig && telergamProxyConfig.port}</div>
              <div style={{fontWeight: "500"}}>🔧Ключ: dd{telergamProxyConfig && telergamProxyConfig.secret}</div>
            </div>
          </div>
          <div style={{marginTop: "50px"}}>
            <div className={styles.itemTitle}>Youtube на телефоне</div>
            <div>Чтобы Youtube заработал на вашем телефоне настройте прокси вашей WIFI-сети:</div>
            <div style={{fontWeight: "500"}}>🔧Сервер: {ip}</div>
            <div style={{fontWeight: "500"}}>🔧Порт: 8124</div>
            <div><a href={iosInstruction} target="_blank">🥤Инструкция для IOS</a></div>
            <div><a href={androidInstruction} target="_blank">🥤Инструкция для Android</a></div>
          </div>
        </div>
      </div>
    </div>
  )
}