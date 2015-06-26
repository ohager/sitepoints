var $q = require("q");
var $objectId = require('mongodb').ObjectID;
var BaseRepository = require("./base-repo");


function SitepointsRepository() {

    this.getSitepointsByFilter = function (filter) {
        var deferred = $q.defer();
        this.mongodb.sitepoints.find(filter,
            function (err, data) {
                this.handleDeferredDbResult(deferred, err, data);
            }.bind(this));
        return deferred.promise;
    };

    this.getAllSitepointsByAccountId = function (accountId) {
        return this.getSitepointsByFilter({account_id: $objectId(accountId)});
    };

    this.getAllSitepointsByUrl = function (url) {
        return this.getSitepointsByFilter({url: url});
    };

    this.addSitepoints = function (sitepoints) {
        var deferred = $q.defer();

        this.mongodb.sitepoints.insert(sitepoints, function (err, res) {
            this.handleDeferredDbResult(deferred, err, res);
        }.bind(this));

        return deferred.promise;
    };
}

SitepointsRepository.prototype = new BaseRepository("sitepoints");
SitepointsRepository.prototype.constructor = SitepointsRepository;

module.exports = new SitepointsRepository();