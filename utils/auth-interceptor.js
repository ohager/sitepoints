var authService = require("../services/auth-service");
var $responseUtils = require("../utils/response-utils");
var $config = require("../config");


function AuthInterceptor(){

    this.verifyToken = function(req, res, next){

        if(!$config.auth.required){
            next();
            return;
        }

        var token = req.get("Authorization");
        if(!token){
            $responseUtils.unauthorizedError(res, "Token Required");
        }

        token = token.replace("SP-AUTH ", "");

        req.sitepointsContext.authRepository.findToken(token)
            .then(function(authToken) {
                if(!authToken) throw "Invalid Token";
                if(authToken.expiry < Date.now()) throw "Token expired";

                next();
            })
            .catch(function(error){
                $responseUtils.unauthorizedError(res, error);
            });
    }
}

module.exports = new AuthInterceptor();
