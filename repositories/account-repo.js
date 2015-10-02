var $q = require("q");
var $objectId = require('mongodb').ObjectID;
var $authService = require('../services/auth-service');
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
        var deferred = $q.defer();
        this.mongodb.accounts.findOne({user:user},
            function (err, data) {
                this.handleDeferredDbResult(deferred, err, data);
            }.bind(this));
        return deferred.promise;
    };

    this.findAccountById = function(id){
        var deferred = $q.defer();
        var objId;
        try{
            objId = $objectId(id);
        }catch(err){
            deferred.reject(err);
        }

        this.mongodb.accounts.findOne({_id:objId},
            function (err, data) {
                this.handleDeferredDbResult(deferred, err, data);
            }.bind(this));
        return deferred.promise;
    };

    this.findAccountsByDomain = function(domain){
        return this.getAccountsByFilter({domain:domain});
    };

    this.createAccount = function(account){
        var deferred = $q.defer();
        var self = this;
        $authService.generatePasswordHash(account.password).then(
            function(hashedPassword) {
                account.created = Date.now();
                account.password = hashedPassword;
                self.mongodb.accounts.insert(account, function (err, data) {
                    self.handleDeferredDbResult(deferred, err, data);
             })
         });

        return deferred.promise;
    };

    this.updateAccount = function(account, updatePassword){
        var deferred = $q.defer();
        var self = this;

        if(updatePassword){
            $authService.generatePasswordHash(account.password).then(
                function(hashedPassword) {
                    account.password = hashedPassword;
                    self.mongodb.accounts.update( { user : account.user} ,account, function (err, data) {
                        self.handleDeferredDbResult(deferred, err, data);
                    })
                });
        }else
        {
            self.mongodb.accounts.update( { user : account.user} ,account, function (err, data) {
                self.handleDeferredDbResult(deferred, err, data);
            })
        }


        return deferred.promise;
    }
}

AccountRepository.prototype = new BaseRepository("accounts");
AccountRepository.prototype.constructor = AccountRepository;

module.exports = new AccountRepository();