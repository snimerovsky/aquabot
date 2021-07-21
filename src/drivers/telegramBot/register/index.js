import registerMessages from "./registerMessages";
import registerFunctions from "./registerFunctions";
import registerScenes from './registerScenes'

export default class BotRegisterIndex {
    constructor(app) {
        this.app = app;
        this.messages = new registerMessages(app)
        this.functions = new registerFunctions(app)
        this.scenes = new registerScenes(app)
    }

    initStages = (stages) => {
        for (let scene of this.scenes.scenes) {
            stages.register(scene)
        }
    };
}