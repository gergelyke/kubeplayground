const http = require('http');
const crypto = require('crypto');
const fs = require('fs');

const version = fs.readFileSync("version");
const memLeak = {};

const handleRequest = function(request, response) {
  console.log('Received request for URL: ' + request.url);
  memLeak[crypto.randomBytes(256)] = crypto.randomBytes(10000);
  response.writeHead(200);
  response.end(`Hello Playground! ${version}`);
};

const www = http.createServer(handleRequest);
www.listen(8080);
