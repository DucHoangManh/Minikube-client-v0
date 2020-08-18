var express = require('express')
var request = require('request')
var cors = require('cors')
var app = express()

app.use(cors())

app.use('/', function(req, res) {
  var url = 'http://' +
    req.get('host').replace('127.0.0.1:8000', '127.0.0.1:8001') + 
    req.url
  req.pipe(request({ qs:req.query, uri: url })).pipe(res);
})

app.listen(8000, function () {
  console.log('CORS-enabled web server listening on port 8000')
})