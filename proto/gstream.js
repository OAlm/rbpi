/**
 * Created by nikitak on 17.5.2017.
 */
function Gstream(data, portBlacklist) {
    this.sink = data.sink;
    this.port = data.port;
    this.resolution = data.resolution;
    this.vf = (data.vf == 'true');
    this.hf = (data.hf == 'true');
    this.portBlacklist = portBlacklist;
}


Gstream.prototype.startStream = function () {
    //TODO important! Check variables before passing them to the execution
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(this.sink)) {
        if (/^(\d{1,5})$/.test(this.port) && parseInt(this.port) < 65536 && this.portBlacklist.indexOf(this.port) === -1) {
            if (/^(\d{3,4}x\d{3,4})$/.test(this.resolution)) {
                var res = this.resolution.split("x");
                this.process = exec("raspivid -n -o - -t 0 " + ((this.vf) ? '-vf ' : '') + ((this.hf) ? '-hf ' : '') + "-w " + res[0] + " -h " + res[1] + " -fps 30 -b 25000000 | gst-launch-1.0 -e -vvvv fdsrc  ! h264parse ! rtph264pay pt=96 ! udpsink host=" + this.sink + " port=" + this.port, function (error, stdout, stderr) {
                    if (error) {
                        console.log("Error: ", error);
                    } else {
                        console.log("Started");//<<Should return form here
                    }
                });
                console.log("raspivid -n -o - -t 0 " + ((this.vf) ? '-vf ' : '') + ((this.hf) ? '-hf ' : '') + "-w " + res[0] + " -h " + res[1] + " -fps 30 -b 25000000 | gst-launch-1.0 -e -vvvv fdsrc  ! h264parse ! rtph264pay pt=96 ! udpsink host=" + this.sink + " port=" + this.port);
                return "Fake start";
            } else {
                return "Invalid Resolution";
            }
        } else {
            return "Invalid Port";
        }
    } else {
        return "Invalid ip address";
    }

};
Gstream.prototype.stopStream = function () {
    var process = this.process;
    if (process != null) {
        //maybe process.kill();
        process.disconnect();
    }
    return "Fake stop";
};
Gstream.prototype.status = function () {
    console.log(this.process.stdout);
    return "Fake status";
};

module.exports = Gstream;