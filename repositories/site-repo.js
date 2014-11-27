var $q = require("q");
var $mongo = require("mongojs");

function SitesRepository() {
    var self = this;
    var mongodb = null;

    var MongoErrorCode = {
        DUPLICATE_KEY: 11000
    };

    this.connect = function (connectionString) {
        console.log("Connecting to mongodb: " + connectionString);
        mongodb = $mongo.connect(connectionString, ['sites']);
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

    this.addOrGetSite = function (siteUrl, onSuccess, onError) {

        var data = {
            url: siteUrl,
            created: new Date().toISOString()
        };

        var siteExists = function (err) {
            return err && err.code === MongoErrorCode.DUPLICATE_KEY;
        };

        var deferred = $q.defer();
        mongodb.sites.insert(data,
            function (err, result) {

                if (siteExists(err)) {
                    self.getSiteByUrl(data.url, onSuccess, onError).then(
                        function (site) {
                            deferred.resolve(site);
                        },
                        function (err) {
                            deferred.reject(err);
                        }
                    );
                } else if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }

            });
        return deferred.promise;
    };
}

module.exports = new SitesRepository();