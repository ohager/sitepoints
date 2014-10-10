var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.send('RestAPI is online');
});

router.get('/site/all', function (req, res) {

    var repository = req.sitepointsRepository;
    
    repository.getAllSites(function (sites) {
            res.send(JSON.stringify(sites));
        },
        function (error) {
            res.send(error);      
      });
});

router.get('/site', function (req, res) {
    
    var repository = req.sitepointsRepository;
    var site_url = req.query.url;
        
    repository.getSiteByUrl(site_url, function (site) {
            res.send(JSON.stringify(site));
        },
        function (error) {
            res.send(error);      
      });
    
    
});

router.get('/sitepoint/all', function (req, res) {
    
    var repository = req.sitepointsRepository;
    var site_url = req.query.url;
        
    repository.getAllSitepointsOfSiteByUrl(site_url, function (sitepoints) {
            res.send(JSON.stringify(sitepoints));
        },
        function (error) {
            res.send(error);      
      });
    
    
});


router.get('/site/:site_id/sitepoint/all', function (req, res) {
    
    var repository = req.sitepointsRepository;
    var siteId = req.params.site_id;
    
    repository.getAllSitepointsOfSiteById(siteId, function (sitepoints) {
            res.send(JSON.stringify(sitepoints));
        },
        function (error) {
            res.send(error);      
      });    
});


router.post('/site', function(req, res){
    var repository = req.sitepointsRepository;    
    
    repository.addSite(req.body.url, function(result){
        res.send(JSON.stringify(result));
    }, function(error){
        res.send(error);
    });

});


router.post('/sitepoints', function(req, res){
    var repository = req.sitepointsRepository;    
    
    repository.addSitepoints(req.body, function(result){
        res.send(JSON.stringify(result));
    }, function(error){
        res.send(error);
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