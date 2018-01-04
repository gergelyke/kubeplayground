const http = require('http');
const fs = require('fs');
const { performance } = require('perf_hooks');

const PORT = 8080;
const version = fs.readFileSync('version');
let gotSIGTERM = false;

const server = http.createServer((req, res) => {
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

console.log('Starting up');
server.listen(PORT, _ => {
  console.log('Up');
});

process.on('SIGTERM', _ => {
  gotSIGTERM = true;
  console.log('SIGTERM');
  setInterval(_ => {
    console.log('Waiting to Close');
  }, 10000);

  performance.mark('A');
  server.close(_ => {
    performance.mark('B');
    performance.measure('A to B', 'A', 'B');
    const measure = performance.getEntriesByName('A to B')[0];
    console.log(`Server closed ${measure.duration}`);
  });
});
