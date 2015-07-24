var $q = require("q");
var $objectId = require('mongodb').ObjectID;
var $config = require('../config');
var BaseRepository = require("./base-repo");


function AuthenticationRepository(){

    this.saveToken = function (token) {
        var deferred = $q.defer();

        var authToken = {
            token : token,
            expiry : Date.now() + $config.auth.tokenExpiry
        };

        this.mongodb.auths.insert(authToken,
            function (err, data) {
                this.handleDeferredDbResult(deferred, err, data);
            }.bind(this));
        return deferred.promise;
    };

    this.findToken = function(token){
        this.mongodb.auths.findOne({token:token}, function(err,data){
            this.handleDeferredDbResult(deferred, err, data);
        }.bind(this));
    };

    this.removeToken = function(token){
        this.mongodb.auths.remove({token:token}, function(err,data){
            this.handleDeferredDbResult(deferred, err, data);
        }.bind(this));
    }

}

AuthenticationRepository.prototype = new BaseRepository("auths");
AuthenticationRepository.prototype.constructor = AuthenticationRepository;

module.exports = new AuthenticationRepository();