const schedule = require("node-schedule");

export default class CronJob {
    constructor(app) {
        this.app = app;
        // this.checkActiveUser();
    }

    checkActiveUser = async () => {
        this.users = await this.app.DAL.postgresDB.getTableData({
            columnName: 'users'
        });
        for (var i = 1; i <= this.users.length; i++) {
            ((index) => {
                setTimeout(async () => {
                    try {
                        const res = await this.app.bot.bot.telegram.sendChatAction(
                            this.users[index - 1].chat_id,
                            "typing"
                        );
                        await this.app.DAL.postgresDB.updateTableData({
                            columnName: 'users',
                            id: this.users[index - 1].id,
                            data: {
                                is_active: true
                            },
                            types: ['bool']
                        })
                    } catch (e) {
                        await this.app.DAL.postgresDB.updateTableData({
                            columnName: 'users',
                            id: this.users[index - 1].id,
                            data: {
                                is_active: false
                            },
                            types: ['bool']
                        })
                    }
                    if (index == this.users.length) {
                        this.checkActiveUser();
                    }
                }, i * 1000);
            })(i);
        }
    };
}
