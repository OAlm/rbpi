/**
 * Created by nikitak on 17.5.2017.
 */
var exec = require('child_process').exec;
function Wowza(data) {
    this.host = data.host;
    this.port = data.port;
    this.resolution = data.resolution;
    this.app = data.app;
    this.streamName = data.streamName;
    this.process = null;
}

Wowza.prototype.startStream = function () {
    console.log("PrePrompt /", this.host);
    //TODO important! Check variables before passing them to the execution
    this.process = exec('ls -la', function (error, stdout, stderr) {
        console.log("Stdout: ", stdout);
        console.log("Stderr: ", stderr);
        if (error) {
            console.log("Error: ", error);
        }
    });
    return "Fake start" + " |\n " + this.host + " |\n " + this.port + " |\n " + this.resolution + " |\n " + this.app + " |\n " + this.streamName;
};
Wowza.prototype.stopStream = function () {
    var process = this.process;
    if (process != null) {
        //maybe process.kill();
        process.disconnect();
    }
    return "Fake stop" + " |\n " + this.host + " |\n " + this.port + " |\n " + this.resolution + " |\n " + this.app + " |\n " + this.streamName;
};
Wowza.prototype.status = function () {
    console.log(this.process.stdout);
    return "Fake status " + " |\n " + this.host + " |\n " + this.port + " |\n " + this.resolution + " |\n " + this.app + " |\n " + this.streamName;
};

module.exports = Wowza;