var $q = require("q");
var $crypto = require("crypto");

function AuthService() {

    this.sign = function (signature, message) {
        var deferred = $q.defer();

        var hmac = $crypto.createHmac('ripemd160', message + 'w8zDwZnYwwmaaXGJJZrM');
        hmac.setEncoding('hex');
        hmac.end(signature, function () {
            deferred.resolve(hmac.read());
        });

        return deferred.promise;
    };

    this.verify = function(signature, message, digestSignatureOrigin){
        var deferred = $q.defer();

        this.sign(signature, message).then(function(digest){
                deferred.resolve(digest === digestSignatureOrigin);
        });

        return deferred.promise;
    };

    this.generateAccessToken = function () {
        var deferred = $q.defer();

        $crypto.randomBytes(20, function (err, buf) {
            var message = buf.toString('hex') + Date.now();

            var hash = $crypto.createHash('sha512');
            hash.setEncoding('hex');
            hash.end(message, function () {
                deferred.resolve(hash.read());
            });

        });

        return deferred.promise;
    };

    this.generatePasswordHash = function (password) {
        var deferred = $q.defer();
        // TODO: remove hardcoded secret/salt and use a randomic sequence instead.
        // This randomic sequence can be prepended to the generated hash
        var hmac = $crypto.createHmac('sha512', "RUZAKqdP7gY92OyRzq7r");
        hmac.setEncoding('hex');
        hmac.end(password, function () {
            deferred.resolve(hmac.read());
        });

        return deferred.promise;
    };


    this.purgeExpiredTokens = function () {
        // TODO: Scheduled clean up of expired tokens
    }

}

module.exports = new AuthService();
