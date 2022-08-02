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
app.use(expressWinston.logger({
    transports:[
        new winston.transports.Console() ,
        new winston.transports.File({filename:"all.log"})
    ],
    format: winston.format.printf((info) => {
        const colorise = chalk[colours[info.level]];
         return `${colorise(info.level)} ${info.message}`;
      })
}));
app.use(router);

app.use(expressWinston.errorLogger({
    transports:[
        new winston.transports.Console() ,
        new winston.transports.File({filename:"error.log"})
    ],
    format:combine(timestamp(), winston.format.printf((info) => {
        const colorise = chalk[colours[info.level]];
        return `${colorise(info.level)} ${info.message}`;
      }))
    }));

app.listen(8000,function(){
    console.log(this.address().port)
});