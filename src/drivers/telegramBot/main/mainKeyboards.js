import {BOT_MESSAGES_BUTTONS} from "../../../utils/utilsVariables";

const { Keyboard } = require('telegram-keyboard')

export const getWelcomeRegisteredKeyboard = () => {
    return Keyboard.make([
        [BOT_MESSAGES_BUTTONS['get_my_bill']],
        [BOT_MESSAGES_BUTTONS['change_number']],
    ]).reply()
}

