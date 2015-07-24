var $q = require("q");
var $crypto = require("crypto");

function AuthService(){
    this.generateAccessToken = function() {
        var deferred = $q.defer();

        $crypto.randomBytes(20,function(err, buf){
            var message = buf.toString('hex') + Date.now();

            var hash = $crypto.createHash('sha512');
            hash.setEncoding('hex');
            hash.end(message, function () {
                deferred.resolve(hash.read());
            });

        });

        return deferred.promise;
    };

    this.generatePasswordHash = function(password){
        var deferred = $q.defer();

        var hmac = $crypto.createHmac('sha512', "RUZAKqdP7gY92OyRzq7r");
        hmac.setEncoding('hex');
        hmac.end(password, function () {
            deferred.resolve(hmac.read());
        });

        return deferred.promise;
    };

}

module.exports = new AuthService();
