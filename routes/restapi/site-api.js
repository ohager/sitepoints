var $express = require('express');
var $auth = require('../../common/auth');
var $router = $express.Router();

var verifyExists = function(res, obj, desc){
    if(!obj){
        res.status(404).send('Resource ' + (desc ? desc : '') + ' not found');
    }
};

var internalServerError = function(res, err){
    res.status(500).send('Internal Server Error: ' + err);
};


// ------------------------------------- QUERIES ------------------------------------------------

$router.get('/all',$auth.authenticate(), function (req, res) {

    var repository = req.sitepointsContext.siteRepository;

    repository.getAllSites().then(
        function (sites) {
            res.send(JSON.stringify(sites));
        },
        function (error) {
            internalServerError(res, error);
        });
});


$router.get('/', function (req, res) {

    var repository = req.sitepointsContext.siteRepository;
    var site_url = req.query.url;

    repository.getSiteByUrl(site_url).then(
        function (site) {
            verifyExists(res, site, site_url);
            res.send(JSON.stringify(site));
        },
        function (error) {
            internalServerError(res, error);
        }
    );
});

$router.get('/:site_id/sitepoint/all', function (req, res) {

    var repository = req.sitepointsContext.sitepointRepository;
    var siteId = req.params.site_id;

    repository.getAllSitepointsOfSiteById(siteId).then(
        function (sitepoints) {
            res.send(JSON.stringify(sitepoints));
        },
        function (error) {
            internalServerError(res, error);
        });
});


$router.get('/:site_id/sitepoint/', function (req, res) {

    var repository = req.sitepointsContext.siteRepository;
    var filter = JSON.parse( req.query.filter );

    repository.getSitepointsByFilter(filter).then( function(sitepoints){
            res.status(501).send(sitepoints);
            //res.send(JSON.stringify(sitepoints))
        },
        function(error){
            internalServerError(res, error)
        }
    );
});


// ------------------------------------- COMMANDS ------------------------------------------------


$router.post('/', function(req, res){
    var repository = req.sitepointsContext.siteRepository;

    repository.addOrGetSite(req.body.url).then(
        function(result){
            res.send(JSON.stringify(result));
        },
        function(error){
            internalServerError(res, error);
        }
    );
});


module.exports = $router;
