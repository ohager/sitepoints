var $q = require('q');
var $express = require('express');
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


$router.get('/', function (req, res) {
    res.send('Sitepoints RestAPI is running...');
});



$router.get('/site/all', function (req, res) {

    var repository = req.sitepointsRepository;

    repository.getAllSites().then(
        function (sites) {
            res.send(JSON.stringify(sites));
        },
        function (error) {
            internalServerError(res, error);
        });
});

$router.get('/site', function (req, res) {
    
    var repository = req.sitepointsRepository;
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

$router.get('/sitepoint/all', function (req, res) {
    
    var repository = req.sitepointsRepository;
    var site_url = req.query.url;

    repository.getSiteByUrl(site_url)
        .then(
            function(site){
                return repository.getAllSitepointsOfSiteById(site._id.toString());
            }
        ).then(
            function (sitepoints) {
                res.send(JSON.stringify(sitepoints));
            },
            function (error) {
                internalServerError(res, error);
            }
        );
});


$router.get('/site/:site_id/sitepoint/all', function (req, res) {
    
    var repository = req.sitepointsRepository;
    var siteId = req.params.site_id;
    
    repository.getAllSitepointsOfSiteById(siteId).then(
        function (sitepoints) {
            res.send(JSON.stringify(sitepoints));
        },
        function (error) {
            internalServerError(res, error);
      });    
});


$router.get('/site/:site_id/sitepoint/', function (req, res) {

    var repository = req.sitepointsRepository;
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


$router.post('/site', function(req, res){
    var repository = req.sitepointsRepository;    
    
    repository.addSite(req.body.url).then(
        function(result){
            res.send(JSON.stringify(result));
        },
        function(error){
            internalServerError(res, error);
        }
    );
});

$router.post('/sitepoints', function(req, res){
    var repository = req.sitepointsRepository;    
    var isSilent = req.query.silent;

    if(isSilent){ // for fire and forget posts -> performance!
        repository.addSitepoints(req.body);
        res.status(200).end();
    }else{
        repository.addSitepoints(req.body).then( function(result){
            res.send(JSON.stringify(result));
        }, function(error){
            internalServerError(res, error);
        });
    }

});


module.exports = $router;
