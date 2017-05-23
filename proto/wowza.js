/**
 * Created by nikitak on 17.5.2017.
 */
var exec = require('child_process').exec;
var settings = require("../settings.json");
function Wowza(data, portBlacklist) {
    this.host = data.host;
    this.port = data.port;
    this.resolution = data.resolution;
    this.app = data.app;
    this.streamName = data.streamName;//defined by pi

    this.vf = (data.vf == 'true');
    this.hf = (data.hf == 'true');

    this.portBlacklist = portBlacklist;

    this.process = null;
}
Wowza.prototype.setNewData = function (data, portBlacklist) {
    this.host = data.host || this.host;
    this.port = data.port || this.port;
    this.resolution = data.resolution || this.resolution;
    this.app = data.app || this.app;
    this.streamName = data.streamName || this.streamName;

    this.vf = (data.vf == 'true');
    this.hf = (data.hf == 'true');

    this.portBlacklist = portBlacklist || this.portBlacklist;

};
Wowza.prototype.start = function () {
    if (this.process != null) {
        this.process.kill("SIGKILL");
    }
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(this.host)) {
        if (/^(\d{1,5})$/.test(this.port) && parseInt(this.port) < 65536 && this.portBlacklist.indexOf(this.port) === -1) {
            if (/^(\d{3,4}x\d{3,4})$/.test(this.resolution)) {
                if (/^\S+\w[^-!@#$%^&*()_+=?/]$/.test(this.app)) {
                    var res = this.resolution.split("x");
                    //TODO username and password

                    this.process = exec('raspivid -n -o - -t 0 ' + ((this.vf) ? '-vf ' : '') + ((this.hf) ? '-hf ' : '') + '-w ' + res[0] + ' -h ' + res[1] + ' -fps 25 -b 25000000 | ffmpeg -i - -s ' + this.resolution + ' -r 25 -vcodec libx264 -an -preset ultrafast -tune zerolatency -f rtsp rtsp://' + settings.wowzaUname + ':' + settings.wowzaPass + '@' + this.host + ':' + this.port + '/' + this.app + '/' + this.streamName, function (error, stdout, stderr) {
                        if (error) {
                            console.log("Error: ", error);
                        } else {
                            console.log("Started");//<<Should return form here
                        }
                    });
                    this.process.stdout.on('data', function(data) {
                        console.log('Wowza stdout: ' + data);
                    });
                    this.process.stderr.on('data', function(data) {
                        console.log('Wowza stdout: ' + data);
                    });
                    this.process.on('close', function(code) {
                        console.log('Wowza closing code: ' + code);
                    });
                    console.log('raspivid -n -o - -t 0 ' + ((this.vf) ? '-vf ' : '') + ((this.hf) ? '-hf ' : '') + '-w ' + res[0] + ' -h ' + res[1] + ' -fps 25 -b 25000000 | ffmpeg -i - -s ' + this.resolution + ' -r 25 -vcodec libx264 -an -preset ultrafast -tune zerolatency -f rtsp rtsp://' + settings.wowzaUname + ':' + settings.wowzaPass + '@' + this.host + ':' + this.port + '/' + this.app + '/' + this.streamName);
                    return "Started";
                }
                else {
                    return "Invalid Application Name";
                }
            } else {
                return "Invalid Resolution";
            }
        } else {
            return "Invalid Port"
        }
    } else {
        return "Invalid ip address";
    }
}
;
Wowza.prototype.stop = function () {

    this.process.kill("SIGKILL");


    return "Fake Stop";
};
Wowza.prototype.status = function () {
    console.log((this.process) ? this.process.stdout || "Fake stdout" : "No Process");
    console.log("Fake status" + " | " + this.host + " | " + this.port + " | " + this.resolution + " | " + this.app + " | " + this.streamName);
    return "Fake status";
};

module.exports = Wowza;