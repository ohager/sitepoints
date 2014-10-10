var mongodriver = require("mongodb");
var mongo = require("mongojs");

function SitepointsRepository() {
    var self = this;
    var mongodb = null;

    var ERR_DUPLICATE_KEY = 11000;

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

    this.getAllSitepointsOfSiteById = function (siteId, onSuccess, onError) {
        mongodb.sitepoints.find({
            'site_id': new mongodriver.ObjectID(siteId)
        }, function (err, sitepoints) {
            if (!err) {
                onSuccess(sitepoints);
            } else {
                onError(err);
            }
        });
    };

    this.getAllSitepointsOfSiteByUrl = function (siteUrl, onSuccess, onError) {
        self.getSiteByUrl(siteUrl, function (site) {
            self.getAllSitepointsOfSiteById(site._id.toString(), onSuccess, onError);
        }, onError);
    };

    this.getSiteByUrl = function (url, onSuccess, onError) {
        mongodb.sites.findOne({
            'url': url
        }, function (err, site) {
            if (!err) {
                onSuccess(site);
            } else {
                onError(err);
            }
        });
    };

    this.addSite = function (siteUrl, onSuccess, onError) {

        var data = {
            url: siteUrl,
            timestamp: Date.now()
        };

        mongodb.sites.insert(data,
            function (err, result) {

                if (err && err.code === ERR_DUPLICATE_KEY) {
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
        timestamp: 1234,
        x : 200,
        y : 200
        },
        {
        timestamp: 1235,
        x : 100,
        y : 200
        }
        ]

    }
    */
    this.addSitepoints = function (sitepointDto, onSuccess, onError) {

        self.addSite(sitepointDto.url, function (site) {

            var data = {
                timestamp: Date.now(),
                site_id : site._id,
                sitepoints : sitepointDto.sitepoints
            };
            
            mongodb.sitepoints.insert(data, function (err, result) {
                if(err){
                    onError(err); return;
                }
                
                var resultData = {
                    _id : result._id,
                    site_id : result.site_id,
                    timestamp : result.timestamp
                };
                
                onSuccess(resultData);
            });

        }, function (err) {
            onError(err);
        });
    }
}


module.exports = new SitepointsRepository;