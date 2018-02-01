const http = require('http');
const terminus = require('@godaddy/terminus');
const fs = require('fs');

const PORT = 8080;
const version = fs.readFileSync('version');
let gotSignal = false;

function onSignal () {
  console.log('server is starting cleanup');
  gotSignal = true;
  return Promise.resolve();
}

function onShutdown () {
  console.log('cleanup finished, server is shutting down');
}

function check() {
  console.log(`/healthcheck ${gotSignal}`);
  return Promise.resolve();
}

const server = http.createServer((request, response) => {
  console.log(`${request.url} ${gotSignal}`);
  setTimeout(() => {
    response.end(`<html><body><h1>Hello, World! v${version}</h1></body></html>`);
  }, 200);
})

terminus(server, {
  // healtcheck options
  healthChecks: {
    '/healthcheck': check          // a promise returning function indicating service health
  },

  // cleanup options
  timeout: 10000,                   // [optional = 5000] number of milliseconds before forcefull exiting
  // signal,                          // [optional = 'SIGTERM'] what signal to listen for relative to shutdown
  onSignal,                        // [optional] cleanup function, returning a promise (used to be onSigterm)
  onShutdown,                      // [optional] called right before exiting
  // both
  logger: console.log                           // [optional] logger function to be called with errors
});

server.listen(PORT);