export default class AppRouter {
    constructor(app) {
        this.app = app;
        this.setupRouter = this.setupRouter.bind(this);

        this.setupRouter();
    }

    setupRouter() {
        const app = this.app;

        console.log("APp ROuter works!");
    }
}