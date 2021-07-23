import http from "http";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import AppRouter from "./appRouter";
import Bot from "./drivers/telegramBot/bot";
import DataAccess from "./dataAccess";
import CronJob from "./cronJob";
require('dotenv').config()

const PORT = process.env.PORT;
const app = express();
app.server = http.createServer(app);

app.use(bodyParser.json());

app.use(
  cors({
    exposedHeaders: "*",
  })
);

app.DAL = new DataAccess(app);
app.cron = new CronJob(app)
app.bot = new Bot(app);
app.routers = new AppRouter(app);

app.server.listen(process.env.PORT || PORT, () => {
  console.log(`App is running on port ${app.server.address().port}`);
});

export default app;
