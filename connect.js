var uws = require('uws');
var App = require('./app');
var settings = require('./settings.json');
const reconnectInterval = 1; //seconds
var uwsClient;
var msgHandler;

function connect() {
    uwsClient = new uws("ws://"+settings.uwsServer+":"+settings.uwsPort, {perMessageDeflate: false});
    msgHandler = new App(uwsClient);

    uwsClient.on('open', function open() {
        uwsClient.send('{"status":"rbpi Initialization"}');

    });

    uwsClient.on('message', msgHandler.msg.bind(msgHandler));

    uwsClient.on('error', function (error) {
        console.log("Error: ", error);
    });
    //Try re-establishing connection on server shutdown
    uwsClient.on('close', function (code, reason) {
        console.log("Closed code: ", code);
        console.log("Closed reason: ", reason);
        setTimeout(connect, reconnectInterval*1000);
    });
}

connect();