const mongoose = require('mongoose')
const os = require('os');
const process = require('process');
const SECONDS = 5000;

const countDBConnect = () => {
    const numConnections = mongoose.connections.length;
    console.log(`Number of connections: ${numConnections}`)
}

// check over load connect
const checkDBOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUse = process.memoryUsage().rss;
        
        // server cho phep 5 connects per core 
        const maxConnections = numCores * 5;

        console.log(`Active connections: ${numConnection}`);
        console.log(`Memory usage:: ${memoryUse / 1024 / 1024} MB`);

        if (numConnection > maxConnections) {
            console.log(`Connection overload detected!`);
            // notify.send(....)
        }

    }, SECONDS);
}

module.exports = {
    countDBConnect,
    checkDBOverload
}