var $express = require('express');
var $router = $express.Router();

var internalServerError = function(res, err){
    res.status(500).send('Internal Server Error: ' + err);
};

var addSitepoints = function(req, res){
    var repository = req.sitepointsContext.sitepointRepository;
    var isSilent = req.query.silent;
    var data = req.body;

    if(isSilent){ // for fire and forget posts -> performance!
        repository.addSitepoints(data.site_id, data.sitepoints);
        res.status(200).end();
    }else{
        repository.addSitepoints(data.site_id, data.sitepoints).then( function(result){
            res.send(JSON.stringify(result));
        }, function(error){
            internalServerError(res, error);
        });
    }
};


// ------------------------------------- QUERIES ------------------------------------------------

$router.get('/sitepoint/all', function (req, res) {
    
    var repository = req.sitepointsContext.sitepointRepository;
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


// ------------------------------------- COMMANDS ------------------------------------------------
/*
{
    "url" : "www.devbutze.com/sitepoints",
    "sitepoints" : [
    {
        "x" : 200,
        "y" : 200
    },
    {
        "x" : 100,
        "y" : 200
    }
    ]
}
 */
$router.post('/', function(req, res){
    var siteRepository = req.sitepointsContext.siteRepository;

    siteRepository.addOrGetSite(req.body.url)
        .then(
            function(site){
                req.body['site_id'] = site._id.toString();
                addSitepoints(req, res);
            }
        ).fail(
            function(err){
                internalServerError(err);
            }
        );
});



module.exports = $router;