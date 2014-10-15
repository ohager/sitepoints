var express = require('express');
var router = express.Router();

var verifyExists = function(res, obj, desc){
    if(!obj){
        res.status(404).send('Resource ' + (desc ? desc : '') + ' not found');
    }
}

var internalServerError = function(res, err){
    res.status(500).send('Internal Server Error: ' + err);
}


// ------------------------------------- QUERIES ------------------------------------------------


router.get('/', function (req, res) {
    res.send('Sitepoints RestAPI is running...');
});



router.get('/site/all', function (req, res) {

    var repository = req.sitepointsRepository;
    
    repository.getAllSites(function (sites) {
            res.send(JSON.stringify(sites));
        },
        function (error) {
          internalServerError(res, error);
      });
});

router.get('/site', function (req, res) {
    
    var repository = req.sitepointsRepository;
    var site_url = req.query.url;
        
    repository.getSiteByUrl(site_url, function (site) {
        
            verifyExists(res, site, site_url);            
            res.send(JSON.stringify(site));
        
        },
        function (error) {
            internalServerError(res, error);
      });
    
    
});

router.get('/sitepoint/all', function (req, res) {
    
    var repository = req.sitepointsRepository;
    var site_url = req.query.url;
    
    repository.getAllSitepointsOfSiteByUrl(site_url, function (sitepoints) {
        
            verifyExists(res, sitepoints, site_url );
            res.send(JSON.stringify(sitepoints));
        
        },
        function (error) {
            internalServerError(res, error);
      });    
});


router.get('/site/:site_id/sitepoint/all', function (req, res) {
    
    var repository = req.sitepointsRepository;
    var siteId = req.params.site_id;
    
    repository.getAllSitepointsOfSiteById(siteId, function (sitepoints) {
        
            verifyExists(res, sitepoints, siteId );
            res.send(JSON.stringify(sitepoints));
        },
        function (error) {
            internalServerError(res, error);
      });    
});


// ------------------------------------- COMMANDS ------------------------------------------------

router.post('/site', function(req, res){
    var repository = req.sitepointsRepository;    
    
    repository.addSite(req.body.url, function(result){
        res.send(JSON.stringify(result));
    }, function(error){
        internalServerError(res, error);
    });

});


router.post('/sitepoints', function(req, res){
    var repository = req.sitepointsRepository;    
    
    repository.addSitepoints(req.body, function(result){
        res.send(JSON.stringify(result));
    }, function(error){
        internalServerError(res, error);
    });

});


module.exports = router;

/*
{ url: "http://www.contoso.com/index.html",
    sp: [
        {
            timestamp: "TIMESTAMP" ,
            x: 123,
            y: 23
        },
        {
            timestamp: "TIMESTAMP" ,
            x: 200,
            y: 79
        },
    ]
}*/