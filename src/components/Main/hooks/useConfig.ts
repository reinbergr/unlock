
import { TelegramProxyConfigType } from "../../../types";

export const useConfig = (tg: TelegramProxyConfigType | null) => ({tg: {port: tg && tg.port, secret: tg && `dd${tg.secret}`}, youtube: {port: 8124}});