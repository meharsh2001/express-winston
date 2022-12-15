const express = require('express');
const { createLogger, format, transports } = require('winston');
const logger = createLogger({
    transports:
        new transports.File({
        filename: 'logs/server.log',
        format:format.combine(
            format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
            format.align(),
            format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
        )}),
    });

const app = express();
app.get('/',(req,res) => {
    res.send("Hello World!");
    logger.info("Server Sent A Hello World!");
})
app.get('/calc',(req,res) => {
    const x = y + 10;
    res.send(x.toString());
})
app.use((err,req,res,next) => {
   logger.error(`${err.status || 500} : ${res.statusMessage} : ${err.message} : ${req.originalUrl} : ${req.method} : ${req.ip}`);
})
app.use((req,res,next) => {
    logger.error(`400 || ${res.statusMessage} : ${req.originalUrl} : ${req.method} : ${req.ip}`);
})
app.listen(3000, () => {
    console.log("Server started...");
    logger.info(`Server started`)
})