/**
 * Created by nikitak on 17.5.2017.
 */
function Gstream(data) {
    this.sink = data.sink;
    this.port = data.port;
    this.resolution = data.resolution;
}

Gstream.prototype.startStream = function () {
    //TODO important! Check variables before passing them to the execution
    return "Fake start" + " |\n " + this.sink + " |\n " + this.port + " |\n " + this.resolution;
};
Gstream.prototype.stopStream = function () {
    return "Fake stop" + " |\n " + this.sink + " |\n " + this.port + " |\n " + this.resolution;
};
Gstream.prototype.status = function () {
    return "Fake status " + " |\n " + this.sink + " |\n " + this.port + " |\n " + this.resolution;
};

module.exports = Gstream;