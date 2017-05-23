var uws = require('uws');
var App = require('./app');
var settings = require('./settings.json');
var exec = require('child_process').exec;

const reconnectInterval = 1; //seconds
var uwsClient;
var msgHandler;


function connect() {
    uwsClient = new uws("ws://" + settings.uwsServer, {perMessageDeflate: false});
    msgHandler = new App(uwsClient);
    uwsClient.on('open', function open() {

        exec("cat /proc/cpuinfo | grep Serial | cut -d ' ' -f 2", function (error, stdout, stderr) {
            if (error) {
                console.log("Id Error: ", error);
                global.id = "fakeId0000000000";
                uwsClient.send(JSON.stringify({
                    status: "rbpiIni",
                    id: "fakeId0000000000"
                }));
            } else {
                global.id = stdout;
                if (stderr) {
                    global.id = "fakeId0000000001";
                    uwsClient.send(JSON.stringify({
                        status: "rbpiIni",
                        id: "fakeId0000000001"
                    }));
                } else {
                    uwsClient.send(JSON.stringify({
                        status: "rbpiIni",
                        id: stdout.trim()
                    }));
                }

            }
        });
    });

    uwsClient.on('message', msgHandler.msg.bind(msgHandler));

    uwsClient.on('error', function (error) {
        console.log("Error: ", error);
        setTimeout(connect, reconnectInterval * 1000);
    });
    //Try re-establishing connection on server shutdown
    uwsClient.on('close', function (code, reason) {
        console.log("Closed code: ", code);
        console.log("Closed reason: ", reason);
        setTimeout(connect, reconnectInterval * 1000);
    });
}

connect();