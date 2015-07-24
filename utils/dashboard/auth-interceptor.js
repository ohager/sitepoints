var authRepo = require("../repositories/auth-repo");
var authService = require("../services/auth-service");
var $responseUtils = require("../utils/response-utils");
var $config = require("../config");


function ApiKeyInterceptor(){

    this.verifyToken = function(req, res, next){



        var token = req.get("Authorization");
        if(!token){
            $responseUtils.unauthorizedError(res, "");
        }

        token = token.replace("SP-AUTH ", "");

        #######

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

module.exports = new ApiKeyInterceptor();
