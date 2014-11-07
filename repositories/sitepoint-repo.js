var $q = require("q");
var $mongo = require("mongojs");
var $objectId = require('mongodb').ObjectID;

function SitepointsRepository() {
    var self = this;
    var mongodb = null;

    this.connect = function (connectionString) {
        console.log("Connecting to mongodb: " + connectionString);
        mongodb = $mongo.connect(connectionString, ['sitepoints']);
        return self;
    };

    this.getSitepointsByFilter = function(filter){
        var deferred = $q.defer();
        deferred.reject("Not implemented yet!");
        return deferred.promise;
    };

    this.getAllSitepointsOfSiteById = function (siteId) {
        var deferred = $q.defer();

        mongodb.sitepoints.aggregate([
                {
                    $match :
                    {
                        site_id : $objectId(siteId)
                    }
                },
                {
                    $group :
                    {
                        _id : '$site_id',
                        sitepoints : { $push : { created: '$created' , x : '$x', y: '$y' } }
                    }
                }
            ],
            function (err, sitepoints) {
                if (!err) {
                    deferred.resolve(sitepoints[0]);
                } else {
                    deferred.reject(err);
                }
            });

        return deferred.promise;
    };

    this.addSitepoints = function (site_id, sitepoints) {
        var deferred = $q.defer();
        var sitepointCount = sitepoints.length;
        var progressed = 0;

        var receiveDate = new Date().toISOString();
        for(var i = 0; i< sitepointCount; ++i) {
            var point = sitepoints[i];

            var data = {
                site_id: $objectId(site_id),
                created: (!point.created ? receiveDate : point.created),
                x: point.x,
                y: point.y
            };
            mongodb.sitepoints.insert(data, function (err) {
                if (!err) {
                    progressed++;
                    if (progressed === sitepoints.length) {
                        var resultData = {
                            site_id: data.site_id,
                            receiveDate: receiveDate,
                            sitepoints: sitepoints.length
                        };
                        deferred.resolve(resultData);
                    }
                } else {
                    deferred.reject(err);
                }
            });
        }
        return deferred.promise;
    };
}


module.exports = new SitepointsRepository;