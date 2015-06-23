var $q = require("q");
var $mongo = require("mongojs");
var $objectId = require('mongodb').ObjectID;

function UserRepository(){
    var self = this;
    var mongodb = null;

    var MongoErrorCode = {
        DUPLICATE_KEY : 11000
    };

    this.connect = function (connectionString) {
        console.log("Connecting to mongodb: " + connectionString);
        mongodb = $mongo(connectionString, ['users']);
        return self;
    };


    this.findUser = function(username){
        var deferred = $q.defer();

        mongodb.users.findOne({
            'username': username
        }, function (err, user) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(user)
            }
        });

        return deferred.promise;
    }

}

module.exports = new UserRepository();