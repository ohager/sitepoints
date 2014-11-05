var $q = require("q");
var $mongo = require("mongojs");
var $objectId = require('mongodb').ObjectID;

function SitepointsRepository() {
    var self = this;
    var mongodb = null;

    var MongoErrorCode = {
        DUPLICATE_KEY : 11000
    };

    this.connect = function (connectionString) {
        console.log("Connecting to mongodb: " + connectionString);
        mongodb = $mongo.connect(connectionString, ['sitepoints', 'sites']);
        return self;
    };

    this.getAllSites = function () {
        var deferred = $q.defer();

        mongodb.sites.find(function (err, sites) {
            if (!err) {
                deferred.resolve(sites);
            } else {
                deferred.reject(err);
            }
        });

        return deferred.promise;
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

    this.getSiteByUrl = function (url) {
        var deferred = $q.defer();
        mongodb.sites.findOne({
            'url': url
        }, function (err, site) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(site)
            }
        });
        return deferred.promise;
    };

    this.addSite = function (siteUrl, onSuccess, onError) {

        var data = {
            url: siteUrl,
            created: new Date().toISOString()
        };

        var siteExists = function (err){
            return err && err.code === MongoErrorCode.DUPLICATE_KEY;
        };

        var deferred = $q.defer();
        mongodb.sites.insert(data,
            function (err, result) {

                if (siteExists(err)) {
                    self.getSiteByUrl(data.url, onSuccess, onError).then(
                        function(site){
                            deferred.resolve(site);
                        },
                        function(err){
                            deferred.reject(err);
                        }
                    );
                }else if (err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(result);
                }

            });
        return deferred.promise;
    };
    /*
    {
        url : "www.devbutze.com/sitepoints",
        sitepoints : [
        {
        created: ISODate,
        x : 200,
        y : 200
        },
        {
        created: ISODate,
        x : 100,
        y : 200
        }
        ]

    }
    */
    this.addSitepoints = function (sitepointDto) {

        var deferred = $q.defer();
        var sitepoints = sitepointDto.sitepoints;
        var receiveDate = new Date().toISOString();
        var progressed = 0;

        self.addSite(sitepointDto.url).then(function (site) {

            for(var i = 0; i< 1000; ++i){
                var point = sitepoints[i%2];
                var data = {
                    site_id : site._id,
                    created: (!point.created? receiveDate : point.created),
                    x : point.x,
                    y : point.y
                };

                mongodb.sitepoints.insert(data, function (err) {
                    if(!err){
                        progressed++;
                        data['progressed'] = progressed;
                        if(progressed === sitepoints.length){
                            var resultData = {
                                site_id: data.site_id,
                                receiveDate: receiveDate,
                                sitepoints_received: sitepoints.length,
                                sitepoints_added: data.progressed
                            };
                            deferred.resolve(resultData);
                        }
                    }else {
                        deferred.reject(err);
                    }
                });
            }
        }).fail(function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };
}


module.exports = new SitepointsRepository;