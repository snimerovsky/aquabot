import {getWelcomeRegisteredKeyboard} from "./mainKeyboards";
import axiosOriginal from 'axios'
import adapter from 'axios/lib/adapters/http'
import {getOrderFormat} from "./mainUtils";

const axios = axiosOriginal.create({ adapter })

export default class BotMainMessages {
    constructor(app) {
        this.app = app;
    }

    replyWelcome = async (ctx) => {
        try {
            let user_data = await this.app.bot.BotMainIndex.functions.getUserData(ctx)
            if (user_data.length > 0) {
                user_data = user_data[0]
                if (user_data['phone']) {
                    return ctx.reply(this.app.bot.BOT_MESSAGES['welcome_registered'].replace('NAME', ctx.message.chat.first_name), getWelcomeRegisteredKeyboard())
                }
            }
            await ctx.reply(this.app.bot.BOT_MESSAGES['welcome'].replace('NAME', ctx.message.chat.first_name))
            await ctx.scene.enter('get_phone_register')
        } catch (e) {
            console.log('error replyWelcome', e.message)
        }
    }

    getMyBill = async (ctx) => {
        try {
            let user_data = await this.app.bot.BotMainIndex.functions.getUserData(ctx)
            if (user_data.length > 0) {
                user_data = user_data[0]
                if (user_data['phone']) {
                    let res = await axios.post(`http://83.221.180.91:9595/api/getorders?phone=${user_data['phone']}`)
                    if (res['data']) {
                        res = res['data']
                        return ctx.reply(getOrderFormat(res['data']['Orders']), getWelcomeRegisteredKeyboard())
                    }
                }
            }
            return this.replyWelcome(ctx)
        } catch (e) {
            console.log('error replyWelcome', e.message)
        }
    }
}