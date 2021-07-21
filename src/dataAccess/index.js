import PostgresSqlConnector from "../db/postgresql/connection";
import PostgreSqlDataBase from './postgresql'

export default class DataAccess {
    constructor(app) {
        this.app = app;

        this.postgresDB = new PostgreSqlDataBase(app)

        this.connectDb = this.connectDb.bind(this);
        this.connectDb();
    }

    connectDb() {
        const DB = new PostgresSqlConnector({}, {
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            database: process.env.POSTGRES_DATABASE,
            password: process.env.POSTGRES_PASSWORD,
            port: process.env.POSTGRES_PORT,
        });
        this.postgresDB.setDb(DB)
    }
}