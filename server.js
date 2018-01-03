const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const terminus = require('@godaddy/terminus');

const PORT = 8080;
const version = fs.readFileSync("version");
const memLeak = {};

const handleRequest = (request, response) => {
  // console.log('Received request for URL: ' + request.url);
  // memLeak[crypto.randomBytes(256)] = crypto.randomBytes(10000);
  setTimeout(_ => {
    response.writeHead(200);
    response.end(`Hello Playground! ${version}`);  
  }, 1000);
};

function onSignal () {
  console.log('server is starting cleanup');
  return Promise.all([
    // your clean logic, like closing database connections
  ]);
}

function onShutdown () {
  console.log('cleanup finished, server is shutting down');
}

function check() {
  return Promise.resolve();
}

console.log('server is starting up')

const server = http.createServer(handleRequest)

terminus(server, {
  // healtcheck options
  healthChecks: {
    '/healthcheck': check          // a promise returning function indicating service health
  },

  // cleanup options
  timeout: 30000,                   // [optional = 5000] number of milliseconds before forcefull exiting
  // signal: 'SIGTERM',                          // [optional = 'SIGTERM'] what signal to listen for relative to shutdown
  onSignal,                        // [optional] cleanup function, returning a promise (used to be onSigterm)
  onShutdown,                      // [optional] called right before exiting

  // both
  // logger                           // [optional] logger function to be called with errors
});

server.listen(PORT, _ => {
  console.log('server is up');
});
