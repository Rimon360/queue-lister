const { Telegraf } = require('telegraf');
const bot = new Telegraf('8434781196:AAGapLYW31rylM_Cc3CwGmgEC2_54iPTIhA');
const GROUP_ID = -5016676579;

bot.telegram.sendMessage(GROUP_ID, 'checking...')
