import mainMessages from "./mainMessages";
import mainFunctions from "./mainFunctions";

export default class BotMainIndex {
    constructor(app) {
        this.app = app;
        this.messages = new mainMessages(app)
        this.functions = new mainFunctions(app)
    }
}