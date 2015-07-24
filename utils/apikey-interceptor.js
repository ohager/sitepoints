var accountRepo = require("../repositories/account-repo");
var apikeyService = require("../services/apikey-service");
var $responseUtils = require("../utils/response-utils");
var $config = require("../config");


function ApiKeyInterceptor(){

    this.verifyAccount = function(req, res, next){

        if(!$config.apiKeyRequired) {
            next();
            return;
        }

        var k = req.query.k;
        if(!k){
            $responseUtils.unauthorizedError(res, "No key!");
        }

        var id = k.slice(0,24);
        var signature = k.slice(24);

        accountRepo.findAccountById(id)
            .then(function(account) {
                return apikeyService.generate(account);
            })
            .then(function(hash){
                if(hash.toLowerCase()===signature.toLowerCase()){
                    next();
                }
                else{
                    $responseUtils.forbiddenError(res, "Invalid Signature!");
                }
            })
            .catch(function(error){
                $responseUtils.unauthorizedError(res, "Authorization Failure!");
            });
    }
}

module.exports = new ApiKeyInterceptor();
