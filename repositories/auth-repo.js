var $q = require("q");
var $objectId = require('mongodb').ObjectID;
var BaseRepository = require("./base-repo");

function AuthenticationRepository(){


    this.findUser = function (filter) {
        var deferred = $q.defer();
        this.mongodb.accounts.find(filter,
            function (err, data) {
                this.handleDeferredDbResult(deferred, err, data);
            }.bind(this));
        return deferred.promise;
    };

    this.findAccountByUser = function(username){
        return this.getAccountsByFilter({username:username});
    };

    this.findAccountById = function(id){
        var deferred = $q.defer();
        this.mongodb.accounts.findOne({_id:$objectId(id)},
            function (err, data) {
                this.handleDeferredDbResult(deferred, err, data);
            }.bind(this));
        return deferred.promise;
    };

    this.findAccountByDomain = function(domain){
        return this.getAccountsByFilter({domain:domain});
    }
}

AuthenticationRepository.prototype = new BaseRepository("accounts");
AuthenticationRepository.prototype.constructor = AuthenticationRepository;

module.exports = new AuthenticationRepository();