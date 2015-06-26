var $mongo = require("mongojs");
var $config = require('../helpers/spec-config');

function MongoCollection(){
    this.mongodb = null;
}

MongoCollection.prototype.connect = function(collectionName){
    this.mongodb = $mongo($config.database.connection, [collectionName]);
    return this.mongodb;
};

module.exports = new MongoCollection();
