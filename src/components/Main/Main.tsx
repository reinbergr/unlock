
import styles from "./Main.module.scss";
import Selectbox, { SelectboxOption } from "../Selectbox/Selectbox";
import { useClipboard } from "./hooks/useClipboard";
import { useConfig } from "./hooks/useConfig";
import { useStrategyTest } from "./hooks/useStrategyTest";
import { StrategyTestResult, TelegramProxyConfigType } from "../../types";
import { QRCodeSVG } from "qrcode.react";
import { SquareLoader } from "react-spinners";
import { Slide, ToastContainer, toast } from "react-toastify";

export interface MainProps {
  ip: string;
  bypassMethods: SelectboxOption[];
  onSelectChange: (method: string) => void;
  strategyTestResult: StrategyTestResult;
  telergamProxyConfig: null | TelegramProxyConfigType;
}

export const Main: React.FC<MainProps> = ({onSelectChange, ip, bypassMethods, strategyTestResult, telergamProxyConfig: proxyTgConfig}) => {
  const [copyToClipboard] = useClipboard();
  const strategy = useStrategyTest(strategyTestResult);
  const config = useConfig(proxyTgConfig);
  const isInit = strategyTestResult === "installing" || strategyTestResult === "requesting";
  
  const notify = (text: string) => toast.success(text);

  const clipboard = async (event: React.MouseEvent<HTMLSpanElement> ) => {
    const clipboardValue = event.currentTarget.dataset.clipboard;
    await copyToClipboard(clipboardValue || "");
    notify("Скопировано в буфер");
  }

  return (
    <div className={styles.mainWrapper}>
      <header className={styles.header}>UNLOCK</header>
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
              {proxyTgConfig && ip && <QRCodeSVG className={styles.qr} size={206} value={`tg://proxy?server=${ip}&port=${proxyTgConfig.port}&secret=dd${proxyTgConfig.secret}`} />}
            <div>
              <div>Или настройте вручную: настройки → прокси → добавить прокси → mtproto</div>
              <div className={styles.itemElement}>→ Сервер: <span onClick={clipboard} data-clipboard={ip}>{ip} [📋]</span></div>
              <div className={styles.itemElement}>→ Порт: <span onClick={clipboard} data-clipboard={config.tg.port}>{config.tg.port} [📋]</span></div>
              <div className={styles.itemElement}>→ Ключ: <span onClick={clipboard} data-clipboard={config.tg.secret}>{config.tg.secret} [📋]</span></div>
            </div>
          </div>
          <div style={{marginTop: "50px"}}>
            <div className={styles.itemTitle}>YOUTUBE на IOS/Android</div>
            <div>Чтобы Youtube заработал на вашем телефоне настройте прокси вашей WIFI-сети:</div>
            <div className={styles.itemElement}>→ Сервер: <span onClick={clipboard} data-clipboard={ip}>{ip} [📋]</span></div>
            <div className={styles.itemElement}>→ Порт: <span onClick={clipboard} data-clipboard={config.youtube.port}>{config.youtube.port} [📋]</span></div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-center" autoClose={1000} hideProgressBar newestOnTop closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Slide} />
    </div>
  )
}