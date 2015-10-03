var $authService = require("../services/auth-service");
var $responseUtils = require("../utils/response-utils");
var $config = require("../config");


function AuthInterceptor(){

    function refreshToken(token){

    }

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

                var splitted = token.split('.');
                return $authService.verify(req.domain, splitted[0], splitted[1]);
            })
            .then(function(verified){
                if(verified){
                    next();
                    return;
                }
                throw "Token not verified";
            })
            .catch(function(error){
                $responseUtils.unauthorizedError(res, error);
            });
    }
}

module.exports = new AuthInterceptor();
