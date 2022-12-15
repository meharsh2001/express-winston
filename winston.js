const express = require("express");
const app = express();
const winston = require("winston");

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});
app.use(function(req,res,next){
    res.on('end',function(){
        logger.error("Events Error: Unauthenticated user");
    })
    next()
})
app.get("/", (req, res, next) => {
  logger.log("debug", "Hello, Winston!");
  logger.debug("The is the home '/' route.");
  res.status(200).send("Logging Hello World..");
});

app.get("/error", (req, res, next) => {
    next(new Error("Not User!"))
});


app.listen(5000, () => {
  logger.info("Server Listening On Port 5000");
});