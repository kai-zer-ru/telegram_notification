var recievers = {
  "users": {
    "user1": 111111111,
    "user2": 222222222,
    "user3": 333333333,
    "user4": 444444444,
    "user5": 555555555,
  },
  "groups": [
    -123456789
  ]
};

var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');
var telegram = require('telegram_notification/telegram');

var chats = {};
var telegramClient = new telegram.Telegram("123456789:AAz_ixtVbPie14ZWNOVtb1lJPPpt4xzakTk"); // Токен здесь естественно липовый


function findUserInText(textToSearch, issue, where) {
  var issueLink = '[' + issue.id + "](" + issue.url + ')';
  var mainChatId = recievers.users[issue.fields.Assignee.login];
  for (var login in recievers.users) {
    // Проверка на упоминание самого себя
    if (login != issue.reporter.login) {
      // Если упомянули кого-то из участников команды
      if (textToSearch) {
        if (textToSearch.search("@" + login) != -1) {
          // Тект, что пользователя упомянули в комментарии
          var currentText = login + ", тебя упомянули в " + where + " к задаче " + issueLink;
          var chatId = recievers.users[login];
          if (chatId != mainChatId) {
            chats[chatId] = currentText;
          }
        }
      }
    }
  }
}
exports.rule = entities.Issue.onChange({
  title: workflow.i18n('Send notification to Telegram when an issue is changed or commented'),
  guard: function(ctx) {
    // Условие простое. Если был оставлен комментарий (не удалён, а именно оставлен) либо изменилось описание задачи
    return !ctx.issue.comments.added.isEmpty() || ctx.issue.becomesResolved || ctx.issue.becomesReported || ctx.issue.becomesUnresolved;
  },
  action: function(ctx) {
    var issue = ctx.issue;
    var issueLink = '[' + issue.id + "](" + issue.url + ')';
    var message, isNew;
    isNew = false;
    if (issue.becomesReported) {
      isNew = true;
    }
    message = issue.summary;
    var changedByName = '';
    var assigne = ctx.issue.fields.Assignee;
    var updater;
    if (isNew) {
      changedByName = issue.reporter.fullName;
      updater = issue.reporter;
    } else {
      changedByName = issue.updatedBy.fullName;
      updater = issue.updatedBy;
    }
    var mainChatId = recievers.users[assigne.login];
    var text = "";
    if (isNew) {
      text = assigne.login + ", на тебя была назначена новая задача\nНазначил: " + changedByName + "\nСсылка: " + issueLink + "\nСостояние: " + issue.fields.State.presentation + "\n" + "Приоритет: " + issue.fields.Priority.presentation + "\nНазвание: " + message;
      var issueText = issue.description;
      findUserInText(issueText, issue, "описании");
    } else {
      var isNewComment = issue.comments.isChanged;
      if (isNewComment) {
        text = "К задаче " + issueLink + " был добавлен новый комментарий:\n";
        var comments = issue.comments;
        comments.forEach(function(comment) {
          console.log(comment.text);
          if (comment.isNew) {
            // Добавляем в текст сообщения текст комментария
            text += "```\n" + comment.text + "\n```";
            findUserInText(comment.text, issue, "комменарии");
          }
        });
      } else {
        text = assigne.login + ", задача " + issueLink + " была обновлена\nОбновил: " + changedByName;
      }
    }
    if (updater.login != assigne.login) { // Если задачу обновил тот, на кого она назначена
    	chats[mainChatId] = text;
    }
    recievers.groups.forEach(function(chatId) {
		  telegramClient.sendMessage(chatId, text);
    });
    // ну и непосредственно отправка в чат
    for (var chatId in chats) {
      var textToSend = chats[chatId];
      telegramClient.sendMessage(chatId, textToSend);
    }
  },
  requirements: {}
});