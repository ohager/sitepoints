var $mongo = require("mongojs");

function BaseRepository(collectionName){
    this.collectionName = collectionName;
}

BaseRepository.prototype.mongodb = undefined;
BaseRepository.prototype.MongoErrorCode = {
        DUPLICATE_KEY : 11000
    };

BaseRepository.prototype.connect = function(connectionString){
    if(!this.collectionName || this.collectionName.length === 0) throw "No collection name defined";
    console.log("Connecting to mongodb: " + connectionString + "/" + this.collectionName);
    this.mongodb = $mongo(connectionString, [this.collectionName]);
    return this;
};

BaseRepository.prototype.handleDeferredDbResult = function(deferred, err, data){
    if(!err){
        deferred.resolve(data);
    }
    else{
        deferred.reject(err);
    }
};

module.exports = BaseRepository;