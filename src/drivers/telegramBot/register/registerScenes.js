import {BOT_MESSAGES_BUTTONS} from "../../../utils/utilsVariables";
const WizardScene = require("telegraf/scenes/wizard");
const { Extra } = require("telegraf");
import axiosOriginal from 'axios'
import adapter from 'axios/lib/adapters/http'

const axios = axiosOriginal.create({ adapter })

export default class BotRegisterScenes {
    constructor(app) {
        this.app = app;
    }

    getPhoneRegister = new WizardScene(
        'get_phone_register',
        async (ctx) => {
            try {
                if (!ctx.session.user_id) {
                    await this.app.bot.BotMainIndex.functions.writeUserToDadabase(ctx)
                }

                await ctx.reply(
                    this.app.bot.BOT_MESSAGES['get_phone'],
                    Extra.markup((markup) => {
                        return markup
                            .resize()
                            .oneTime()
                            .keyboard([
                                {
                                    text: BOT_MESSAGES_BUTTONS["send_phone"],
                                    request_contact: true,
                                }
                            ]);
                    })
                );

                return ctx.wizard.next();

            } catch (e) {
                console.log('error getPhoneOrder 1', e.message)
                return ctx.scene.leave();
            }
        },
        async (ctx) => {
            try {
                let isCommand = await this.checkForCommands(ctx, ctx.update.message);

                ctx.session.register_data = {}

                if (!isCommand) {
                    try {
                        let phone = ctx.update.message.contact.phone_number;
                        ctx.session.register_data['phone'] = phone.replace(/\D/g, "");
                        return ctx.scene.enter('get_phone_code_register')
                    } catch (e) {
                        try {
                            let phone = ctx.message.text;
                            phone = phone.replace(/\D/g, "");
                            if (phone.startsWith("998") && phone.length === 12) {
                                ctx.session.register_data['phone'] = phone
                                return ctx.scene.enter('get_phone_code_register')
                            } else {
                                return ctx.scene.reenter();
                            }
                        } catch (e) {
                            return ctx.scene.reenter();
                        }
                    }
                } else {
                    return ctx.scene.leave();
                }
            } catch (e) {
                console.log('error getPhoneOrder 2', e.message)
                return ctx.scene.leave();
            }
        }
    );

    getPhoneCodeRegister = new WizardScene(
        'get_phone_code_register',
        async (ctx) => {
            try {
                let isCommand = await this.checkForCommands(ctx, ctx.update.message);

                if (!isCommand) {

                    if (!ctx.session.register_data) {
                        return ctx.scene.enter('get_phone_register')
                    }

                    let code = Math.floor(1000 + Math.random() * 9000);
                    ctx.session.code = code
                    let sms_message = this.app.bot.BOT_MESSAGES['sms_message'].replace("CODE", code);
                    let token = Buffer.from(process.env.SMS_TOKEN).toString('base64')

                    await axios.post("http://91.204.239.44/broker-api/send", {
                        messages:
                            [
                                {
                                    recipient: ctx.session.register_data['phone'],
                                    'message-id': "1",
                                    sms:{
                                        originator: "3700",
                                        content: {
                                            text: sms_message
                                        }
                                    }
                                }
                            ]
                    }, {
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Cache-Control': 'no-cache',
                            'Authorization': `Basic ${token}`
                        }
                    });

                    await ctx.reply(this.app.bot.BOT_MESSAGES['get_phone_code'], {reply_markup: {remove_keyboard: true}});
                    return ctx.wizard.next();
                } else {
                    return ctx.scene.leave();
                }
            } catch (e) {
                console.log('error getPhoneOrder 2', e.message)
                return ctx.scene.leave();
            }
        },
        async (ctx) => {
            try {
                let isCommand = await this.checkForCommands(ctx, ctx.update.message);

                if (!isCommand) {
                    if (!ctx.session.user_id) {
                        await this.app.bot.BotMainIndex.functions.writeUserToDadabase(ctx)
                    }

                    if (parseInt(ctx.update.message.text) === parseInt(ctx.session.code)) {
                        await this.app.DAL.postgresDB.updateTableData({
                            columnName: 'users',
                            id: ctx.session.user_id,
                            data: {
                                phone:  ctx.session.register_data['phone']
                            },
                            types: ['string']
                        })
                        await ctx.scene.leave();
                        return this.app.bot.BotMainIndex.messages.replyWelcome(ctx)
                    } else {
                        await ctx.reply(this.app.bot.BOT_MESSAGES['wrong_sms_message'], {reply_markup: {remove_keyboard: true}});
                        return ctx.scene.reenter()
                    }
                } else {
                    return ctx.scene.leave();
                }
            } catch (e) {
                console.log('error getPhoneOrder 2', e.message)
                return ctx.scene.leave();
            }
        }
    )

    scenes = [
        this.getPhoneRegister,
        this.getPhoneCodeRegister
    ]

    checkForCommands = async (ctx, message) => {
        try {
            if (message) {
                if (message.text) {
                    if (message.text.startsWith("/start")) {
                        await ctx.scene.leave();
                        return true;
                    }
                }
            }
            return false;
        } catch (e) {
            console.log('error checkForCommands', e.message)
        }
    };
}