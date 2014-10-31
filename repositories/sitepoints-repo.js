var mongo = require("mongojs");
var ObjectId = require('mongodb').ObjectID;

function SitepointsRepository() {
    var self = this;
    var mongodb = null;

    var MongoErrorCode = {
        DUPLICATE_KEY : 11000
    };

    
    this.connect = function (connectionString) {
        console.log("Connecting to mongodb: " + connectionString);
        mongodb = mongo.connect(connectionString, ['sitepoints', 'sites']);
        return self;
    };

    this.getAllSites = function (onSuccess, onError) {
        mongodb.sites.find(function (err, sites) {
            if (!err) {
                onSuccess(sites);
            } else {
                onError(err);
            }
        });
    };

    this.getSitepointsByFilter = function(filter, onSuccess, onError){
        onError("Not implemented yet!");
    };

    this.getAllSitepointsOfSiteById = function (siteId, onSuccess, onError) {
        mongodb.sitepoints.aggregate([
                {
                    $match :
                    {
                        site_id : ObjectId(siteId)
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
                    onSuccess(sitepoints[0]);
                } else {
                    onError(err);
                }
            });
    };

    this.getAllSitepointsOfSiteByUrl = function (siteUrl, onSuccess, onError) {                    
        
        self.getSiteByUrl(siteUrl, function (site) {        
            if(site){            
                self.getAllSitepointsOfSiteById(site._id.toString(), onSuccess, onError);
            }else{
                onSuccess([]); // send empty
            }
        }, onError);
    };

    this.getSiteByUrl = function (url, onSuccess, onError) {
        mongodb.sites.findOne({
            'url': url
        }, function (err, site) {                                
            if (err) {                
                onError(err);                                
            } else {            
                onSuccess(site);
            }
        });
    };

    this.addSite = function (siteUrl, onSuccess, onError) {

        var data = {
            url: siteUrl,
            created: new Date().toISOString()
        };

        var siteExists = function (err){
            return err && err.code === MongoErrorCode.DUPLICATE_KEY;
        };

        mongodb.sites.insert(data,
            function (err, result) {

                if (siteExists(err)) {
                    self.getSiteByUrl(data.url, onSuccess, onError);
                    return;
                }

                if (err) {
                    onError(err);
                } else {
                    onSuccess(result);
                }
            });
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
    this.addSitepoints = function (sitepointDto, onSuccess, onError) {

        self.addSite(sitepointDto.url, function (site) {

            var sitepoints = sitepointDto.sitepoints;
            var receiveDate = new Date().toISOString();

            for(var i = 0; i< sitepoints.length; ++i){
                var point = sitepoints[i];
                var data = {
                    site_id : site._id,
                    created: (!point.created? receiveDate : point.created),
                    x : point.x,
                    y : point.y
                };

                mongodb.sitepoints.insert(data, function (err) {
                    if(err){
                        onError(err);
                    }
                });
            }

            var resultData = {
                site_id: site._id,
                receiveDate: receiveDate,
                sitepoints_received: sitepoints.length
            };

            onSuccess(resultData);
    }, function (err) {
            onError(err);
        });
    }
}


module.exports = new SitepointsRepository;