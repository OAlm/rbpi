/**
 * Created by nikitak on 17.5.2017.
 */
var Wowza = require('./proto/wowza');
var Gstream = require('./proto/gstream');


function App(uwsClient) {
    this.uwsClient = uwsClient;
    this.protos = {
        wowza: Wowza,
        gstream: Gstream
    };
    this.proto = null;
}
//TODO add security
App.prototype.msg = function (rawData, flags) {
    var app = this;

    try {
        var data = JSON.parse(rawData);
        //Check if proto is correctly defined by the clinet - wowza, gstream . . .
        if (data.proto && app.protos.hasOwnProperty(data.proto)) {
            //TODO sec
            app.proto = new app.protos[data.proto](data);
            if (typeof app.proto[data.method] === "function") {
                app.proto[data.method]();
            } else {
                app.uwsClient.send(JSON.stringify({error: "No such method"}));
            }
        } else {
            app.uwsClient.send(JSON.stringify({error: "No such proto"}));
        }

    } catch (e) {
        console.log("JSON error parsing /", e);
        console.log("DATA /", rawData);
        console.log("Flags /", flags);
    }

};

module.exports = App;