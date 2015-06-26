var $mongo = require("mongojs");

function BaseRepository(collectionName){
    console.log('BaseRepository: ' + collectionName);
    this.collectionName = collectionName;
    this.mongodb = null;
}

BaseRepository.prototype.MongoErrorCode = {
        DUPLICATE_KEY : 11000
    };

BaseRepository.prototype.connect = function(connectionString){
    console.log("connect: " + this.collectionName);
    if(!this.collectionName || this.collectionName.length === 0) throw "No collection name defined";
    console.log("Connecting to mongodb: " + connectionString);
    mongodb = $mongo(connectionString, [this.collectionName]);
    return this;
};

module.exports = BaseRepository;