/**
 * Created by nikitak on 17.5.2017.
 */
var exec = require('child_process').exec;
function Wowza(data, portBlacklist) {
    this.host = data.host;
    this.port = data.port;
    this.resolution = data.resolution;
    this.app = data.app;
    this.streamName = data.streamName;//defined by pi
    this.process = null;
    this.vf = (data.vf == 'true');
    this.hf = (data.hf == 'true');
    this.portBlacklist = portBlacklist;
}

Wowza.prototype.startStream = function () {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(this.host)) {
        if (/^(\d{1,5})$/.test(this.port) && parseInt(this.port) < 65536 && this.portBlacklist.indexOf(this.port) === -1) {
            if (/^(\d{3,4}x\d{3,4})$/.test(this.resolution)) {
                if (/^\S+\w[^-!@#$%^&*()_+=?/]$/.test(this.app)) {
                    var res = this.resolution.split("x");
                    //TODO username and password
                    //this.process = exec('raspivid -n -o - -t 0 ' + ((this.vf) ? '-vf' : '') + ' ' + ((this.hf) ? '-hf' : '') + ' -w '+res[0]+' -h '+res[1]+' -fps 25 -b 25000000 | ffmpeg -i - -s '+this.resolution+' -r 25 -vcodec libx264 -an -preset ultrafast -tune zerolatency -f rtsp rtsp://{username:password@host:port/app/streamName}', function (error, stdout, stderr) {
                        /*this.process = exec('ls -la', function (error, stdout, stderr) {
                            if (error) {
                                console.log("Error: ", error);
                            } else {
                                return "Started";
                            }
                        });*/
                        console.log('raspivid -n -o - -t 0 ' + ((this.vf) ? '-vf ' : '') + ((this.hf) ? '-hf ' : '') + '-w '+res[0]+' -h '+res[1]+' -fps 25 -b 25000000 | ffmpeg -i - -s '+this.resolution+' -r 25 -vcodec libx264 -an -preset ultrafast -tune zerolatency -f rtsp rtsp://'+'username'+':'+'password'+'@'+this.host+':'+this.port+'/'+this.app+'/'+this.streamName);
                        return "Started";
                    }
                else
                    {
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