import BotMainIndex from "./main";
import BotRegisterIndex from "./register";
const { Telegraf, Extra,Markup, session, Stage } = require("telegraf");
const cron = require('node-cron');
import axiosOriginal from 'axios'
import adapter from 'axios/lib/adapters/http'
import {BOT_MESSAGES_BUTTONS} from "../../utils/utilsVariables";

const axios = axiosOriginal.create({ adapter })

export default class Bot {
  constructor(app) {
    this.app = app;
    this.bot = new Telegraf(process.env.BOT_TOKEN);
    this.bot.catch(async (err) => {
      console.log('[ERROR TELEGRAF]: ', err)
    })
    this.stages = new Stage()
    this.BotMainIndex = new BotMainIndex(this.app);
    this.BotRegisterIndex = new BotRegisterIndex(this.app);
    this.initScenes(['BotRegisterIndex'])
    this.init();
  }

  initScenes = (value_scenes) => {
    for (let value of value_scenes) {
      this[value].initStages(this.stages);
    }
  }

  init = async () => {
    await this.getBotMessages()
    this.initBot();
  };

  initBot = () => {
    this.bot.use(async (ctx, next) => {
      const start = new Date();
      await next();
      const response_time = new Date() - start;
      let user_chat;
      let user_text;
      if (ctx) {
        if (ctx.message) {
          user_chat = ctx.message.chat
          user_text = ctx.message.text;
        }
        else if (ctx.update) {
          if (ctx.update.callback_query) {
            user_chat = ctx.update.callback_query.message.chat
          }
        }
      }
      console.log(`(Response Time: ${response_time}) ${user_chat ? `chat_id: ${user_chat.id}, first_name: ${user_chat.first_name}` : ''}
${user_text ? `Text: ${user_text}` : ''}`);
    });
    this.bot.use(session());
    this.bot.use(this.stages.middleware());
    this.startBot();
  };

  listenEvents = () => {
    this.bot.on("callback_query", async (ctx) => {
      try {
        const [type, ...data] = ctx.update.callback_query.data.split(" ");

        if (type === 'cancel_position') {
          await ctx.deleteMessage()
        }

      } catch (e) {
        console.log('error', e.message)
      }
    });

    this.bot.on("text", async (ctx) => {
      if (ctx.message.text === BOT_MESSAGES_BUTTONS['change_number']) {
        return ctx.scene.enter('get_phone_register')
      }
      if (ctx.message.text === BOT_MESSAGES_BUTTONS['get_my_bill']) {
        return this.BotMainIndex.messages.getMyBill(ctx)
      }
    });
  };

  startBot = () => {
    console.log('Bot is running...')
    this.bot.start(async (ctx) => {
      await this.BotMainIndex.functions.writeUserToDadabase(ctx)
      await this.BotMainIndex.messages.replyWelcome(ctx)
    });
    this.listenEvents();
    this.bot.launch();
  };

  getBotMessages = async () => {
    try {
      let res = await this.app.DAL.postgresDB.getTableData({
        columnName: 'bot_messages'
      })
      this.BOT_MESSAGES = {}
      for (let val of res) {
        this.BOT_MESSAGES[val['type']] = val['text']
      }
      await this.getBotMessagesCron()
    } catch (e) {
      console.log('error getBotMessages', e.message)
    }
  }

  getBotMessagesCron = async () => {
    try {
      cron.schedule('0 0 */6 * * *', async () => {
        let res = await this.app.DAL.postgresDB.getTableData({
          columnName: 'bot_messages'
        })
        this.BOT_MESSAGES = {}
        for (let val of res) {
          this.BOT_MESSAGES[val['type']] = val['text']
        }
      })
    } catch (e) {
      console.log('error getBotMessagesCron', e.message)
    }
  }
}
