    var express = require('express');
var expressWinston = require('express-winston');
var winston = require('winston');
var bodyParser = require('body-parser');
const chalk = require('chalk');
var app = module.exports = express();   

const { combine, timestamp, label, printf, json } = winston.format;

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + "/public"));
app.set("view engine","hbs");
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
router.get('/errorlog',function(req,res,next){
  return next(new Error("error page"));
});
router.get('/',function(req,res,next){    
  res.render("home");
});
router.post('/',function(req,res,next){
});
app.use(function(req,res,next){console.log(req.body.harsh);
next()})

expressWinston.requestWhitelist.push('body')
expressWinston.responseWhitelist.push('body')
app.use(expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: 'logs/server.log',
      format:winston.format.combine(
          winston.format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
          winston.format.align(),
      )})
  ],
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting, with the same colors. Enabling this will override any msg and colorStatus if true. Will only output colors on transports with colorize set to true
  colorStatus: true, // Color the status code, using the Express/morgan color palette (default green, 3XX cyan, 4XX yellow, 5XX red). Will not be recognized if expressFormat is true
  ignoreRoute: function (req, res) { 
    res.on('finish',function(){
    if(req.url === '/error') return false;
    else return true; })} // optional: allows to skip some log messages based on request and/or response
}));
app.use(router);
app.listen(8000,function(){
    console.log(this.address().port)
});