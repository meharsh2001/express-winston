var express = require('express');
var expressWinston = require('express-winston');
var winston = require('winston');
const chalk = require('chalk');
var app = module.exports = express();   

const { combine, timestamp, label, printf, json } = winston.format;

const colours = {
    debug: 'grey',
    info: 'green',
    warn: 'cyan',
    error: 'red'
  };
var router = express.Router();
router.get('/error',function(req,res,next){
    return next(new Error("error page"));
});
router.get('/',function(req,res,next){
    res.write("home");
    res.end();
});
app.use(expressWinston.errorLogger({
    transports:
    new winston.transports.File({
    filename: 'logs/server.log',
    format:winston.format.combine(
        winston.format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
        winston.format.align(),
        winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
    )}),
    format: winston.format.printf((info) => {
        const colorise = chalk[colours[info.level]];
         return `${colorise(info.level)} ${info.message}`;
      })
}));
app.use(router);
app.listen(8000,function(){
    console.log(this.address().port)
});