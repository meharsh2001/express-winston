var express = require('express');
var app = module.exports = express();  
var XMLHttpRequest = require('xhr2'); 
const url = 'http://localhost:5000/#userManagement'; 

function load(url, callback) {
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      callback(xhr.response);
    }
  }

  xhr.open('GET', url, true);
  xhr.send('');
}

app.use(load())
app.listen(8000,function(){
    console.log(this.address().port)
});