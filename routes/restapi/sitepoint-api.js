var $responseUtils = require('../../utils/response-utils');
var $apikeyInterceptor = require('../../utils/apikey-interceptor');
var $express = require('express');
var $router = $express.Router();

// base route: /restapi/sitepoint

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
            $responseUtils.internalServerError(res, error);
        });
    }
};


// ------------------------------------- QUERIES ------------------------------------------------

$router.get('/all', [ $apikeyInterceptor.verifyAccount,  function (req, res) {
    
    var sitepointRepository = req.sitepointsContext.sitepointRepository;
    var site_url = req.query.url;

    if(!site_url){
        $responseUtils.badRequestError(res,"Missing parameter: 'url'");
        return;
    }

    sitepointRepository.getAllSitepointsByUrl(site_url).then(function(sitepoints){
        res.send(sitepoints);
    }).catch(function(err){
        $responseUtils.internalServerError(res, err);
    });

}]);


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
$router.post('/', [$apikeyInterceptor.verifyAccount, function(req, res){
    var sitepointRepository = req.sitepointsContext.sitepointRepository;
    var sitepoints = req.body;

    sitepointRepository.addSitepoints(sitepoints).then(function(){
        $responseUtils.noContent(res);
    }).catch(function(err){
        $responseUtils.internalServerError(res,err);
    })
}]);

module.exports = $router;
