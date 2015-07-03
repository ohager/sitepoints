var $q = require("q");
var $objectId = require('mongodb').ObjectID;
var BaseRepository = require("./base-repo");

function AccountRepository(){

    this.getAccountsByFilter = function (filter) {
        var deferred = $q.defer();
        this.mongodb.accounts.find(filter,
            function (err, data) {
                this.handleDeferredDbResult(deferred, err, data);
            }.bind(this));
        return deferred.promise;
    };

    this.findAccountByUser = function(user){
        return this.getAccountsByFilter({user:user});
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
    };

    this.createAccount = function(account){
        var deferred = $q.defer();
        account.created = Date.now();

        this.mongodb.accounts.insert(account, function(err, data){
            this.handleDeferredDbResult(deferred, err, data);
        }.bind(this));
        return deferred.promise;
    };
}

AccountRepository.prototype = new BaseRepository("accounts");
AccountRepository.prototype.constructor = AccountRepository;

module.exports = new AccountRepository();