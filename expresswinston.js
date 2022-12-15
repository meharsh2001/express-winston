var express = require('express');
var expressWinston = require('express-winston');
var LoggingWinston = require('@google-cloud/logging-winston').LoggingWinston;

const app = express()

app.use(expressWinston.logger({
    transports: [new LoggingWinston({})],
    metaField: null, //this causes the metadata to be stored at the root of the log entry
    responseField: null, // this prevents the response from being included in the metadata (including body and status code)
    requestWhitelist: ['headers', 'query'],  //these are not included in the standard StackDriver httpRequest
    responseWhitelist: ['body'], // this populates the `res.body` so we can get the response size (not required)
    dynamicMeta:  (req, res) => {
      const httpRequest = {}
      const meta = {}
      if (req) {
        meta.httpRequest = httpRequest
        httpRequest.requestMethod = req.method
        httpRequest.requestUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
        httpRequest.protocol = `HTTP/${req.httpVersion}`
        // httpRequest.remoteIp = req.ip // this includes both ipv6 and ipv4 addresses separated by ':'
        httpRequest.remoteIp = req.ip.indexOf(':') >= 0 ? req.ip.substring(req.ip.lastIndexOf(':') + 1) : req.ip   // just ipv4
        httpRequest.requestSize = req.socket.bytesRead
        httpRequest.userAgent = req.get('User-Agent')
        httpRequest.referrer = req.get('Referrer')
      }
    
      if (res) {
        meta.httpRequest = httpRequest
        httpRequest.status = res.statusCode
        httpRequest.latency = {
          seconds: Math.floor(res.responseTime / 1000),
          nanos: ( res.responseTime % 1000 ) * 1000000
        }
        if (res.body) {
          if (typeof res.body === 'object') {
            httpRequest.responseSize = JSON.stringify(res.body).length
          } else if (typeof res.body === 'string') {
            httpRequest.responseSize = res.body.length
          }
        }
      }
      return meta
    }
}));

app.get("/", (req, res, next) => {
    res.status(200).send("Logging Hello World..");
  });
  
  app.get("/error", (req, res, next) => {
      next(new Error("Not User!"))
  });
app.listen(5000, () => {
    console.log("Server Listening On Port 5000");
  });