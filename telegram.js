/**
 * @module telegram_notification/telegram
 */

var WEBHOOK_URL = "https://api.telegram.org/bot";
var http = require('@jetbrains/youtrack-scripting-api/http');

/**
 * @typedef {Object} Telegram
 *
 * @classdesc Main class that is used to connect workflow to telegram.
 *
 * @property {string} [botToken] Telegram BOT-Token
 *
 * @example
 * var telegramClient = new telegram.Telegram('MyBotToken');
 * telegramClient.send(123456789, 'Test text');
 */

/**
 * Creates an object that lets you send notify to telegram
 * @param {string} [botToken] Telegram BOT-Token
 * @constructor Telegram
 *
 * @see sendMessage
 */
var Telegram = function(botToken) {
  this.botToken = botToken;
};


/**
 * Send message to Telegram
 * @param {int|string} [chatId] - Reciever ID in Telegram
 * @param {string} [text] Text to send.
 * @returns {boolean} If sended - return true, else - return false
 */
Telegram.prototype.sendMessage = function(chatId, text) {
  var payload = {
    "chat_id": chatId,
    "text": text,
    "parse_mode": "Markdown",
  };
  var connection = new http.Connection(WEBHOOK_URL + this.botToken + "/sendMessage", null, 2000);
  connection.addHeader("Content-Type", "application/json");
  var response = connection.postSync("", [], JSON.stringify(payload));
  if (!response.isSuccess) {
    console.warn('Failed to post notification to Telegram. Details: ' + response.toString());
  }
  return this;
};

exports.Telegram = Telegram;