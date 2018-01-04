const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const terminus = require('@godaddy/terminus');
const { performance } = require('perf_hooks');

const PORT = 8080;
const version = fs.readFileSync("version");
const memLeak = {};
let shutdownStarted = false;

const handleRequest = (request, response) => {
  if (shutdownStarted) {
    console.log(`Received request for URL: ${request.url}`);
  }
  
  // console.log('Received request for URL: ' + request.url);
  // memLeak[crypto.randomBytes(256)] = crypto.randomBytes(10000);
  setTimeout(_ => {
    response.writeHead(200);
    response.end(`Hello Playground! ${version}`);  
  }, 5000);
};

const server = http.createServer(handleRequest)

process.on('SIGTERM', _ => {
  console.log('SIGTERM');
  shutdownStarted = true;
  setInterval(_ => {
    console.log('waiting to close');
  }, 10000);

  // if(!shutdownStarted) {
  //   console.log('1st SIGTERM');
  //   performance.mark('A');
  //   shutdownStarted = true;
  // } else {
  //   performance.mark('B');
  //   performance.measure('A to B', 'A', 'B');
  //   const measure = performance.getEntriesByName('A to B')[0];
  //   console.log(`2nd SIGTERM ${measure.duration}`);
  // }
  performance.mark('A');
  server.close(_ => {
    performance.mark('B');
    performance.measure('A to B', 'A', 'B');
    const measure = performance.getEntriesByName('A to B')[0];
    console.log(`SERVER CLOSED ${measure.duration}`);
  });
})



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
  return Promise.all()
}

console.log('server is starting up')

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
  logger: console.log                           // [optional] logger function to be called with errors
});

server.listen(PORT, _ => {
  console.log('server is up');
});
