
<b>Приложение</b> для <b>Windows</b> <b>для обхода блокировок Youtube/Discord/Telegram</b>
<img width="1136" height="943" alt="image" src="https://github.com/user-attachments/assets/d73be327-b3a5-4c7a-ac39-26055a5aefca" />

## Install
качаем <b>[Unlock-Windows-1.0.0-Setup.exe](https://github.com/reinbergr/unlock/releases/download/v1.0.0/Unlock-Windows-1.0.0-Setup.exe)</b> → устанавливаем → запускаем → выбираем стратегию → настраиваем мобильные устройства

## Как работает
- [x] <b>2-прокси.</b> Приложение запускает 2 локальных прокси-сервера: <b>forward-proxy/tg-ws-proxy. </b>Первый решает проблему со входом в Youtube с IOS/Android. Второй решает проблему со входом в Telegram.
- [x] <b>Выбор стратегии обхода DPI.</b> При выборе стратегии запускается <b>winws.exe</b>. Он модифицирует исходящие сетевые пакеты (через WinDivert на Windows) чтобы обмануть DPI/ТСПУ-фильтры провайдера. <br>
- [x] <b>Закрытие приложения.</b> По дефолту оно свернется в трей.<br>
Закрыть его можно из трея: ПКМ → закрыть Unlock<br>
После закрытия приложения автоматически закроются proxy-серверы и winws.exe

## DPI
Тут выбирается стратегия. Смотрим заработал ли YouTube. Если нет выбираем другую (пока не заработает)

## Telegram на телефоне
На IOS/Android-смартфоне сканируем QR-код. Откроется приложение Telegram с автоматической настройкой proxy-сервера. Альтернативно предусмотрена настройка вручную

## Youtube на телефоне
Чтоб заработал Youtube на IOS/Android-смартфоне настраиваем прокси-сервер:<br>
Приложение сгенерирует настройки → указываем их в настройках WIFI-сети в телефоне

## Used opensource
<b>[https://github.com/Flowseal/zapret-discord-youtube](https://github.com/Flowseal/zapret-discord-youtube)</b><br>
<b>[https://github.com/Flowseal/tg-ws-proxy](https://github.com/Flowseal/tg-ws-proxy)</b>

## Stack
Electron⚡️Vite https://electron-vite.github.io<br>
Electron-builder https://www.electron.build<br>
Node.js® https://nodejs.org/en<br>
React https://react.dev<br>
Typescript https://www.typescriptlang.org
