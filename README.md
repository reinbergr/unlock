<b>🚀UNLOCK</b> — программа для Windows которая обходит DPI-блокировки и региональные ограничения.<br> <b>Разблокирует: YouTube, Discord, Instagram, Facebook, Telegram</b> заблокированные провайдером или РКН.<br>
Программа имеет простой графический интерфейс а также поддержку Telegram/Youtube на IOS/Android.<br>
![GitHub Releases](https://img.shields.io/github/downloads/reinbergr/unlock/total?style=for-the-badge&logo=github&color=blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)
![Windows Version](https://img.shields.io/badge/Windows-10%2F11-0078D6?style=for-the-badge&logo=windows&logoColor=white)
<br>
<b>Стек:</b> <br>
Electron⚡️Vite https://electron-vite.github.io<br>
Electron-builder https://www.electron.build<br>
Node.js® https://nodejs.org/en<br>
React https://react.dev<br>
Typescript https://www.typescriptlang.org<br><br>
<b>📥Установка:</b> скачиваем <b>[Unlock-Windows-1.0.0-Setup.exe](https://github.com/reinbergr/unlock/releases/download/v1.0.0/Unlock-Windows-1.0.0-Setup.exe)</b> → устанавливаем → запускаем → выбираем стратегию → настраиваем мобильные устройства<br>

<b>⚠️NOTE:</b> для корректной работы приложения включите безопасный DNS(Secure-DNS) в браузере и убедитесь что все ваши устройства находятся в одной локальной сети(LAN)


<b>Used opensource:</b><br>
[https://github.com/Flowseal/tg-ws-proxy](https://github.com/Flowseal/tg-ws-proxy)</b><br>
[https://github.com/Flowseal/zapret-discord-youtube](https://github.com/Flowseal/zapret-discord-youtube)

## Скриншот
<img width="1136" height="943" alt="image" src="https://github.com/user-attachments/assets/d73be327-b3a5-4c7a-ac39-26055a5aefca" />

## 🔀Как работает
- [x] <b>2-прокси.</b> Приложение запустит 2 локальных прокси-сервера: <b>forward-proxy/tg-ws-proxy. </b>Первый решает проблему со входом в Youtube с IOS/Android. Второй решает проблему со входом в Telegram.
- [x] <b>Выбор стратегии обхода DPI.</b> При выборе стратегии запустится <b>winws.exe</b> для модифицикации исходящих сетевых пакетов (через WinDivert/Windows) чтобы обмануть DPI/ТСПУ-фильтры провайдера. Это нужно чтоб заработал Youtube/Discord.
- [x] <b>Закрытие приложения.</b> По дефолту оно свернется в трей.
Закрыть его можно из трея: ПКМ → закрыть<br>
После закрытия приложения автоматически закроются proxy-серверы и winws.exe

## DPI
Тут выбирается стратегия. Смотрим заработал ли Youtube. Если нет выбираем другую (пока не заработает)

## Telegram на телефоне
На IOS/Android-смартфоне сканируем QR-код. Откроется приложение Telegram с автоматической настройкой proxy-сервера. Альтернативно предусмотрена настройка вручную

## Youtube на телефоне
Чтоб заработал Youtube на IOS/Android-смартфоне настраиваем прокси-сервер:<br>
Приложение сгенерирует настройки → указываем их в настройках WIFI-сети в телефоне
