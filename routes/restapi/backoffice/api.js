/**
 * Created by oliver on 20.11.2014.
 */
var $express = require('express');
var $router = $express.Router();
var $responseUtils = require('../../../utils/response-utils');
/**
 * /url/?pattern=<expr>
 */
$router.post('/url', function (req, res) {

    var payload = req.body;
    var regex;
    try{
        regex = new RegExp(payload.pattern);
    }catch(err){
        $responseUtils.badRequestError(res,err.message);
        return;
    }

    req.sitepointsContext.sitepointRepository.getSitepointsGroupedByUrl(regex).then(function(result){
        var r = result.map(function(urlObj){
            return urlObj.url;
        });
        $responseUtils.ok(res, r);
    }).catch(function(err){
        $responseUtils.internalServerError(res,err);
    });
});


module.exports = $router;
