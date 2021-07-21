export default class BotMainFunctions {
    constructor(app) {
        this.app = app;
    }

    writeUserToDadabase = async (ctx) => {
        try {
            let user_chat = {}
            if (ctx.update.callback_query) {
                user_chat = ctx.update.callback_query.message.chat
            } else {
                user_chat = ctx.message.chat
            }
            ctx.session.chat_id = user_chat.id;
            ctx.session.user_id = await this.app.DAL.postgresDB.createTableData({
                columnName: 'users',
                data: {
                    chat_id: user_chat.id,
                }
            })

            if (!ctx.session.user_id && ctx.session.chat_id) {
                let user = await this.app.DAL.postgresDB.getTableData({
                    columnName: 'users',
                    data: {
                        chat_id: ctx.session.chat_id
                    },
                    types: ['int']
                })
                if (user.length > 0) {
                    ctx.session.user_id = user[0]['id']
                }
            }
        } catch (e) {
            console.log("error writeUserToDadabase", e.message);
        }
    };

    getUserData = async (ctx) => {
        if (!ctx.session.user_id) {
            await this.writeUserToDadabase(ctx)
        }

        return await this.app.DAL.postgresDB.getTableData({
            columnName: 'users',
            data: {
                id: ctx.session.user_id
            },
            types: ['int']
        })
    }
}