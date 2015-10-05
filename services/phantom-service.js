var $path = require("path");
var $childProcess = require("child_process");
var $phantomjsPath = require("phantomjs").path;

var $crypto = require("crypto");

function PhantomService(){
    this.captureScreen = function(url) {
        var deferred = $q.defer();

        var childArgs = [
            $path.join(__dirname + '/phantomscripts', 'capturescreen.js'),
            ''
        ];

        childProcess.execFile($phantomjsPath, childArgs, function(err, stdout, stderr) {
            if(!err){
                deferred.resolve();
            }
            else{
                deferred.reject(err);
            }
        });

        return deferred.promise;
    };
}

module.exports = new PhantomService();
