var $q = require("q");

var $crypto = require("crypto");

function ApiKeyService(){
    var SALT = "trlD232LV1Xzpr3ymp3o"; // used random.org for creation
    this.generate = function(account) {
        var deferred = $q.defer();

        var secret = account.created + SALT;
        var hmac = $crypto.createHmac('ripemd160', secret);
        hmac.setEncoding('hex');
        hmac.end(account.username, function () {
            deferred.resolve(hmac.read());
        });

        return deferred.promise;
    };
}

module.exports = new ApiKeyService();
