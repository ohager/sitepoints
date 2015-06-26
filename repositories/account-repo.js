var $q = require("q");
var $mongo = require("mongojs");
var $objectId = require('mongodb').ObjectID;

function AccountRepository(){
    var self = this;
    var mongodb = null;

    var MongoErrorCode = {
        DUPLICATE_KEY : 11000
    };

    this.connect = function (connectionString) {
        console.log("Connecting to mongodb: " + connectionString);
        mongodb = $mongo(connectionString, ['accounts']);
        return self;
    };


    this.findAccountByUsername = function(username){
        var deferred = $q.defer();

        mongodb.accounts.findOne({
            'username': username
        }, function (err, account) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(account)
            }
        });

        return deferred.promise;
    }

    this.findAccountByDomain = function(domain){
        var deferred = $q.defer();

        mongodb.accounts.findOne({
            'domain': domain
        }, function (err, account) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(account)
            }
        });

        return deferred.promise;
    }

}

module.exports = new AccountRepository();