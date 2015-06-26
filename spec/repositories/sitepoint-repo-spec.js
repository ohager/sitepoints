describe("Sitepoint Repository", function(){
    var sitepointRepo = require('../../repositories/sitepoint-repo');
    var config = require('../helpers/spec-config');
    var ACCOUNT_ID = "558ca1c79a01706400490b33";
    var mongodb = require("../helpers/mongodb-helper");


    beforeAll(function() {
        sitepointRepo.connect(config.database.connection);
    });

    it("returns all sitepoints by account id", function(done) {

        sitepointRepo.getAllSitepointsByAccountId(ACCOUNT_ID).then(
            function(sitepoints){
                expect(sitepoints.length).toBe(16);
            }
        ).catch(function(err){expect(err).toBeUndefined();})
            .finally(done);
    });

    it("returns all sitepoints by url", function(done) {

        sitepointRepo.getAllSitepointsByUrl("http://www.devbutze.com/sitepoints").then(
            function(sitepoints){
                expect(sitepoints.length).toBe(3);
            }
        ).catch(function(err){expect(err).toBeUndefined();})
            .finally(done);
    });

    it("add sitepoints", function(done) {

        var addingSitepoint = {
            account_id: ACCOUNT_ID,
            url: "http://www.devbutze.com/sitepoints/added",
            created: new Date(2015,6,26),
            x: 100,
            y: 100
        };

        sitepointRepo.addSitepoints([addingSitepoint])
            .then(function(result){
                return sitepointRepo.getAllSitepointsByUrl(addingSitepoint.url);
            })
            .then(function(sitepoints){
                var result = sitepoints[0];
                expect(result.x).toBe(100);
                expect(result.y).toBe(100);
                expect(result.account_id).toBe(ACCOUNT_ID);
            })
            .catch(function(err){expect(err).toBeUndefined();})
            .finally(function(){
                var db = mongodb.connect('sitepoints');
                db.sitepoints.remove({url : addingSitepoint.url});
                done();
            });

    });


});
