
import styles from "./Main.module.scss";
import Selectbox, { SelectboxOption } from "../Selectbox/Selectbox";
import { QRCodeSVG } from "qrcode.react";
import { TelegramProxyConfigType } from "../../types";

const appName = "UNLOCK";
const appVer = "v1.0.0";
const appIcon = "https://play-lh.googleusercontent.com/_hTXWITjPuY_g6Z_XAhyfTQRuwJ7fACyNCUU0tW1Zp-AhNCAzs5EzIdMC74aDI8vlA";
const telegramIcon = "https://static.vecteezy.com/system/resources/previews/031/737/201/non_2x/telegram-icon-telegram-social-media-logo-free-png.png";
const youtubeIcon = "https://camo.githubusercontent.com/19c2a6f0c2aac24c0a1b014fb9c3b1490f38f628e9af7c3098b1f0465c5f7e2c/68747470733a2f2f63646e2d69636f6e732d706e672e666c617469636f6e2e636f6d2f3132382f313338342f313338343036302e706e67";
const discordIcon = "https://camo.githubusercontent.com/bcf2026e75e73aedc5d3548666bd13944c13f3c4125ed9cd981031c06d08cf4e/68747470733a2f2f63646e2d69636f6e732d706e672e666c617469636f6e2e636f6d2f3132382f353936382f353936383735362e706e67";
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
        <img style={{borderRadius: "50%", transform: "scale(0.7)"}} src={appIcon} width={80} />
        <div>{appName} <span style={{fontSize: "1rem"}}>{appVer}</span></div>
        <img src={telegramIcon} width={50} />
        <img src={youtubeIcon} width={50} /> 
        <img src={discordIcon} width={50} /> 
      </header>
      <br></br>
      <br></br>
      <div className={styles.items}>
        <div className={styles.item}>
          <div className={styles.itemTitle}>1. DPI</div>
          <div>⚠️Выберите стратегию обхода DPI</div>
          <div style={{fontWeight: "500", marginBottom: "5px"}}>⚠️Если Youtube не заработает выберите другую</div>
          <Selectbox text="Стратегия обхода" options={bypassMethods} onSelectChange={onSelectChange} />
        </div>
        <div className={styles.item}>
          <div className={styles.itemTitle}>2. Telegram на телефоне</div>
          <div style={{marginBottom: "10px"}}>Чтобы Telegram заработал на вашем телефоне просто отсканируйте QR-code:</div>
          {telergamProxyConfig && ip && <QRCodeSVG size={256} value={`tg://proxy?server=${ip}&port=${telergamProxyConfig.port}&secret=dd${telergamProxyConfig.secret}`} />}
          <div>
            <div>Или настройте вручную:</div>
            <div>Настройки → Прокси → Добавить прокси → MTProto</div>
            <div style={{fontWeight: "500"}}>🥤Сервер: {ip}</div>
            <div style={{fontWeight: "500"}}>🥤Порт: {telergamProxyConfig && telergamProxyConfig.port}</div>
            <div style={{fontWeight: "500"}}>🥤Ключ: dd{telergamProxyConfig && telergamProxyConfig.secret}</div>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemTitle}>3. Youtube на телефоне</div>
          <div>Чтобы Youtube заработал на вашем телефоне настройте прокси вашей WIFI-сети:</div>
          <div style={{fontWeight: "500"}}>🥤Сервер: {ip}</div>
          <div style={{fontWeight: "500"}}>🥤Порт: 8124</div>
          <div><a href={iosInstruction} target="_blank" style={{fontWeight: "500", color: "black"}}>🥤Инструкция для IOS</a></div>
          <div><a href={androidInstruction} target="_blank" style={{fontWeight: "500", color: "black"}}>🥤Инструкция для Android</a></div>
        </div>
      </div>
    </div>
  )
}