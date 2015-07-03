var accountRepo = require("../repositories/account-repo");
var apikeyService = require("../services/apikey-service");
var $responseUtils = require("../utils/response-utils");
var $config = require("../config");


function AuthInterceptor(){

    this.verifyAccount = function(req, res, next){

        if(!$config.apiKeyRequired) {
            next();
            return;
        }

        var k = req.query.k;
        if(!k){
            $responseUtils.badRequestError(res, "Missing query attribute 'k'");
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
                    next(new Error("Invalid signature"));
                }
            })
            .catch(function(error){
                next(new Error(error));
            });
    }
}

module.exports = new AuthInterceptor();
