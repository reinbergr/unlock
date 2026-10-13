
import styles from "./Main.module.scss";
import Selectbox, { SelectboxOption } from "../Selectbox/Selectbox";
import { useStrategyTest } from "./hooks/useStrategyTest";
import { StrategyTestResult, TelegramProxyConfigType } from "../../types";
import { QRCodeSVG } from "qrcode.react";
import { SquareLoader } from "react-spinners";

const appName = "UNLOCK";

export interface MainProps {
  ip: string;
  bypassMethods: SelectboxOption[];
  onSelectChange: (method: string) => void;
  strategyTestResult: StrategyTestResult;
  telergamProxyConfig: TelegramProxyConfigType | null;
}

export const Main: React.FC<MainProps> = ({ip, bypassMethods, onSelectChange, telergamProxyConfig, strategyTestResult}) => {
  const strategy = useStrategyTest(strategyTestResult);
  const isInit = strategyTestResult === "installing" || strategyTestResult === "requesting";

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
          <Selectbox text="Стратегия обхода" options={bypassMethods} onSelectChange={onSelectChange} disabled={isInit} />
          <br></br>
          <div className={styles.spinner} style={{color: strategy?.color}}>{isInit && <SquareLoader size={12.5} />}&nbsp;{strategy?.text}</div>
        </div>
        <div className={styles.item}>
          <div>
            <div className={styles.itemTitle}>TELEGRAM на IOS/Android</div>
            <div style={{marginBottom: "10px"}}>Чтобы Telegram заработал на вашем телефоне отсканируйте QR-code:</div>
              {telergamProxyConfig && ip && <QRCodeSVG className={styles.qr} size={256} value={`tg://proxy?server=${ip}&port=${telergamProxyConfig.port}&secret=dd${telergamProxyConfig.secret}`} />}
            <div>
              <div>Или настройте вручную: настройки → прокси → добавить прокси → mtproto</div>
              <div style={{fontWeight: "500"}}>→ Сервер: {ip}</div>
              <div style={{fontWeight: "500"}}>→ Порт: {telergamProxyConfig && telergamProxyConfig.port}</div>
              <div style={{fontWeight: "500"}}>→ Ключ: dd{telergamProxyConfig && telergamProxyConfig.secret}</div>
            </div>
          </div>
          <div style={{marginTop: "50px"}}>
            <div className={styles.itemTitle}>YOUTUBE на IOS/Android</div>
            <div>Чтобы Youtube заработал на вашем телефоне настройте прокси вашей WIFI-сети:</div>
            <div style={{fontWeight: "500"}}>→ Сервер: {ip}</div>
            <div style={{fontWeight: "500"}}>→ Порт: 8124</div>
          </div>
        </div>
      </div>
    </div>
  )
}