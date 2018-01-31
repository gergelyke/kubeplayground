const http = require('http');
const fs = require('fs');
const { performance } = require('perf_hooks');
const stoppable = require('stoppable');

const PORT = 8080;
const SERVER_GRACE_STOP_MS = 10 * 1000;
const READINESS_FAILURE_TIME_MS = 2 * 2 * 1000 + 5000; // periodSeconds * failureThreshold + a bit more just in case
const version = fs.readFileSync('version');
let gotSIGTERM = false;

let server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url.match(/\/healthcheck/)) {
    if (gotSIGTERM) {
      console.log(`Healthcheck ${req.url} NOT OK`);
      res.writeHead(500);
      res.end('not ok');
    } else {
      console.log(`Healthcheck ${req.url} ok`);
      res.writeHead(200);
      res.end('ok');
    }
  } else {
    if (gotSIGTERM) {
      console.log(`Request after SIGTERM: ${req.url}`);
    }
    setTimeout(_ => {
      res.writeHead(200);
      res.end(`Hello Playground! ${version}`);
    }, 100);
  }
});

server = stoppable(server, SERVER_GRACE_STOP_MS);

console.log('Starting up');
server.listen(PORT, _ => {
  console.log('Up');
});

process.on('SIGTERM', _ => {
  gotSIGTERM = true;
  console.log('SIGTERM');
  performance.mark('A');

  // Let the readiness probes fail before we close the server
  setTimeout(_ => {
    server.stop(_ => {
      performance.mark('B');
      performance.measure('A to B', 'A', 'B');
      const measure = performance.getEntriesByName('A to B')[0];
      console.log(`Server closed ${measure.duration}`);
    });
  }, READINESS_FAILURE_TIME_MS);
});
