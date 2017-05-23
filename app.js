/**
 * Created by nikitak on 17.5.2017.
 */
var Wowza = require('./proto/wowza');
var Gstream = require('./proto/gstream');

const PORT_BLACKLIST = [
    80,
    8080,
    443
];

function App() {
    this.uwsClient = null;
    this.protos = {
        wowza: Wowza,
        gstream: Gstream
    };
    this.proto = {
        wowza: null,
        gstream: null
    };
}
//TODO add security
App.prototype.msg = function (rawData, flags) {
    var app = this;
    try {
        var data = JSON.parse(rawData);
        //Check if proto is correctly defined by the clinet - wowza, gstream . . .
        if (data.proto && app.protos.hasOwnProperty(data.proto)) {
            //TODO sec
            if (app.proto[data.proto] === null) {
                app.proto[data.proto] = new app.protos[data.proto](data, PORT_BLACKLIST);
            } else {
                app.proto[data.proto]["setNewData"](data, PORT_BLACKLIST);
            }
            //check if client wrote method correctly
            if (typeof app.proto[data.proto][data.method] === "function") {
                var streaming = null;
                for (var proto in app.proto) {
                    console.log("app proto:", proto);
                    if (!streaming && app.proto[proto]["status"]() === "Streaming") {
                        streaming = proto;
                    }
                }
                if (data.method === 'start' && streaming) {
                    app.uwsClient.send(JSON.stringify({
                        id: global.id,
                        msg: "Already streaming: " + streaming
                    }));
                } else {
                    app.uwsClient.send(JSON.stringify({
                        id: global.id,
                        msg: app.proto[data.proto][data.method]()
                    }));
                }
            } else {
                app.uwsClient.send(JSON.stringify({
                    id: global.id,
                    error: "No such method"
                }));
            }
        } else if (data.status) {
            console.log(data.status);
        } else {
            app.uwsClient.send(JSON.stringify({
                id: global.id,
                error: "No such proto"
            }));
        }

    } catch (e) {
        console.log("JSON error parsing /", e);
        console.log("DATA /", rawData);
        console.log("Flags /", flags);
    }

};

module.exports = App;