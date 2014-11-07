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
        mongodb = $mongo.connect(connectionString, ['user']);
        return self;
    };

}

module.exports = new UserRepository();