var express = require('express');
var expressWinston = require('express-winston');
var winston = require('winston'); // for transports.Console
var app = module.exports = express();
// Let's make our express `Router` first.
var router = express.Router();
function error(next){
  return next(new Error("This is an error and it should be logged to the console"));
}

// express-winston logger makes sense BEFORE the router
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    })
  ]
}));

// Now we can tell the app to use our routing code:
app.use(router);

// express-winston errorLogger makes sense AFTER the router.
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    })
  ]
}));

router.get('/error', function(req, res, next) {
  // here we cause an error in the pipeline so we see express-winston in action.
  error(function(error,data){
    next(error)
  })
});

router.get('/', function(req, res, next) {
  res.write('This is a normal request, it should be logged to the console too');
  res.end();
});

app.listen(3000, function(){
  console.log("express-winston demo listening on port %d in %s mode", this.address().port, app.settings.env);
});