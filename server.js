const { app: { port } } = require('./src/configs/config')

// start server nodejs
const app = require('./src/app')

const server =  app.listen(port, () => {
    console.log(`ecommerce start with port ${port}`);
});

// SIGINT: This is a signal that is typically sent to a process 
// when a user types Ctrl+C in the terminal.
process.on('SIGINT', () => {
    server.close(() => {
        console.log('exit server express');
        // server.close() only stops the server from accepting new connections and closes all connections connected to this server 
        process.exit() // must have to exit the server quickly while in developement
    });

    // notify send (ping....)
});
