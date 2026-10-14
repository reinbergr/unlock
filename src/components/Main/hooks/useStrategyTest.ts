
import { StrategyTestResult } from "../../../types";

export const useStrategyTest = (strategyTestResult: StrategyTestResult) => {
  if (strategyTestResult === "requesting") return {text: "Запрашиваем административные права...", color: "#aaa"};
  if (strategyTestResult === "installing") return {text: "Устанавливаем стратегию...", color: "#aaa"};
  if (strategyTestResult && typeof strategyTestResult === "object") {
    const {discord, youtube} = strategyTestResult;
    if (!discord && !youtube) return {text: "✅Выбранная стратегия работает для Discord и Youtube", color: "#44944a"};
    if (!discord && youtube) return {text: "⚠️Выбранная стратегия работает только для Discord", color: "#fffaa0"};
    if (!youtube && discord) return {text: "⚠️Выбранная стратегия работает только для Youtube", color: "#fffaa0"};
    if (youtube && discord) return {text: "Выбранная стратегия не работает для вашего провайдера и не обходит DPI-блокировки Discord/Youtube (рекомендуем поменять стратерию)", color: "#a12330"};
  }
}