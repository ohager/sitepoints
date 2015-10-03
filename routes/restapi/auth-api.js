var $responseUtils = require('../../utils/response-utils');
var $authService = require('../../services/auth-service');
var $authInterceptor = require('../../utils/auth-interceptor');
var $express = require('express');
var $router = $express.Router();
// ------------------------------------- QUERIES ------------------------------------------------

$router.get('/token/renewal', [$authInterceptor.verifyToken, function (req, res) {
    $responseUtils.notFoundError(res,"Implement me!");
}]);

$router.get('/logout', [$authInterceptor.verifyToken, function (req, res) {

    var authRepository = req.sitepointsContext.authRepository;
    // the auth interceptor uarantees the existance of this token when arrive here
    var token = req.get("Authorization");
    authRepository.removeToken(token)
        .then(function () {
            $responseUtils.noContent(res);
        })
        .catch(function (err) {
            $responseUtils.internalServerError(res, err);
        });
}]);


$router.post('/login', function (req, res) {
    var accountRepository = req.sitepointsContext.accountRepository;
    var credentials = req.body;
    var foundAccount;
    var generatedToken;

    accountRepository.findAccountByUser(credentials.user).then(function (account) {
        foundAccount = account;
        if (!foundAccount) {
            $responseUtils.notFoundError(res, "Unknown User!");
        }
        else {
            return $authService.generatePasswordHash(credentials.password);
        }
    }).then(function (hashedPassword) {
        if (foundAccount.password !== hashedPassword) {
            $responseUtils.unauthorizedError(res, "Login failed!");
        } else {
            return $authService.generateAccessToken();
        }
    }).then(function (accessToken) {
        generatedToken = accessToken;
        return $authService.sign(req.domain, generatedToken);
    }).then(function(digestSignature){
        generatedToken += '.' + digestSignature;
        return req.sitepointsContext.authRepository.saveToken(generatedToken);
    }).then(function () {
        res.set("X-Authorization", "SP-AUTH " + generatedToken).status(200).send({
            firstName: foundAccount.firstName,
            lastName: foundAccount.lastName,
            user: foundAccount.user
        });
    }).catch(function (err) {
        $responseUtils.internalServerError(res, err);
    });

});


module.exports = $router;
