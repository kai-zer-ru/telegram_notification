# telegram_notification

Для активации импортируйте в свой workflow данный скрипт

```javascript
var telegram = require('telegram_notification/telegram');
var telegramClient = new telegram.Telegram("BOT:TOKEN");
telegramClient.sendMessage(chatId, text);
```

Вот в принципе и вся работа с workflow.

Использовать можно написав новое workflow либо добавив эти строки в уже готовое. 
Я советую заменить отправку в Slack на отправку в Telegram
