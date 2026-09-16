<b>Electron-приложение</b> для <b>Windows</b> на базе проекта <a href="https://github.com/bol-van/zapret" target="_blank">zapret</a> <b>для обхода блокировок Youtube/Discord/Telegram.</b> DPI bypass tool
<img width="1136" height="952" alt="image" src="https://github.com/user-attachments/assets/88566e2c-eaab-454e-b66a-d46af712427a" />

## Цель
Удобный выбор стратегии обхода блокировки Youtube/Telegram/Discord
<br>Разблокировка доступа для мобильных устройств

## Как работает
Приложение разворачивает <b>2 локальных прокси-сервера: forward-proxy и tg-ws-proxy</b>
<br>Первый нужен для доступа к Youtube с устройств
<br>Второй нужен для доступа к Telegram и с десктопа и с устройств
<br><b>Выбор стратегии.</b> При выборе стратегии запускается .bat-скрипт который запускает <b>winws.exe с параметрами.</b>
<br><b>winws.exe</b> модифицирует исходящие сетевые пакеты (через WinDivert на Windows) чтобы обмануть DPI/ТСПУ-фильтры провайдера. Затрудняется распознавание к какому сайту идет обращение → доступ к некоторым ресурсам восстанавливается.<br>
<b>Закрытие приложения.</b> По дефолту оно свернется в трей.<br>
Закрыть его можно из трея: ПКМ → закрыть Unlock<br>
После закрытия приложения автоматически закроются proxy-серверы и winws.exe

## DPI
Тут выбирается стратегия обхода блокировки. Если выбранная стратегия не работает (youtube не заработал) выбирается другая

## Telegram на телефоне
На IOS/Android-смартфоне сканируем QR-код. Откроется приложение Telegram с автоматической настройкой proxy-сервера. Альтернативно предусмотрена настройка вручную

## Youtube на телефоне
Чтоб заработал Youtube на IOS/Android-смартфоне настраиваем прокси-сервер:<br>
Приложение сгенерирует настройки → указываем их в настройках WIFI-сети в телефоне

## Используемые opensource-проекты
<a href="https://github.com/Flowseal/zapret-discord-youtube" target="_blank">https://github.com/Flowseal/zapret-discord-youtube (стратегии)</a><br>
<a href="https://github.com/Flowseal/tg-ws-proxy" target="_blank">https://github.com/Flowseal/tg-ws-proxy (tg-ws-proxy)</a>

## Установка
скачиваем <b>Unlock-Windows-1.0.0-Setup.exe</b> → устанавливаем → запускаем Unlock → выбираем стратегию (пока выбранная стратегия не будет работать) → настраиваем мобильные устройства (см пункты Telegram/Youtube на телефоне)