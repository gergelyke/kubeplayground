let isShutdown = false;

process.on('SIGTERM', _ => {
    isShutdown = true;
});

module.exports = _ => isShutdown ? Promise.resolve() : Promise.reject();
