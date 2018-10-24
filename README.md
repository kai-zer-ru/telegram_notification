# telegram_notification

## Установка

Для установки расширения необходимо:
 - скачать самый свежий релиз по ссылке https://github.com/kaizer666/telegram_notification/releases
 - перейти на страницу `/admin/workflows` в Вашем `Youtrack`, к примеру https://youtrack.mycompany.com/admin/workflows
 - Нажать "Импортировать рабочий процесс" или "Import workflow"

## Использование

 - импортируйте в свой workflow данный скрипт

```javascript
var telegram = require('telegram_notification/telegram');
```
 - передайте в конструктор объекта токен Вашего бота

```
var telegramClient = new telegram.Telegram("BOT:TOKEN");
```

 - отправьте сообщение в нужный чат (либо пользователю) по его ID в Telegram

```
telegramClient.sendMessage(chatId, text);
```

Вот в принципе и вся работа с workflow.

Использовать можно написав новое workflow либо добавив эти строки в уже готовое. 
Я советую заменить отправку в Slack на отправку в Telegram

## Примеры

В директории `examples` Вы всегда сможете найти свежие и рабочие примеры использования данного скрипта.