var $responseUtils = require('../../../utils/response-utils');
var $authService = require('../../../services/auth-service');
var $express = require('express');
var $router = $express.Router();

// ------------------------------------- QUERIES ------------------------------------------------

$router.post('/login', function (req, res) {
    var accountRepository = req.sitepointsContext.accountRepository;
    var credentials = req.body;
    var foundAccount;
    var generatedToken;

    accountRepository.findAccountByUser(credentials.user).then(function(account){
        foundAccount = account;
        if(!foundAccount) {
            $responseUtils.notFoundError(res, "Unknown User!");
        }
        else{
            return $authService.generatePasswordHash(credentials.password);
        }
    }).then(function(hashedPassword){
        if(foundAccount.password !== hashedPassword){
            $responseUtils.unauthorizedError(res, "Login failed!");
        }else{
            return $authService.generateAccessToken();
        }
    }).then(function(accessToken){
        generatedToken = accessToken;
        return req.sitepointsContext.authRepository.saveToken(generatedToken);
    }).then(function(){
        res.set("Authorization", "SP-AUTH "  + generatedToken).status(200).send();
    }).catch( function(err){
        $responseUtils.internalServerError(res,err);
    });

});


module.exports = $router;
