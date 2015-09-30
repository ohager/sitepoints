var $responseUtils = require('../../utils/response-utils');
var $authInterceptor = require('../../utils/auth-interceptor');
var $apikeyService= require('../../services/apikey-service');

var $express = require('express');
var $router = $express.Router();

function validateAccountSchema(account) {
    return account.lastName && account.firstName && account.domain && account.user && account.password;
}

// ------------------------------------- QUERIES ------------------------------------------------

$router.put('/:user', function (req, res) {
    res.send('Account API - Implement me');
});

$router.get('/:user', [$authInterceptor.verifyToken, function (req, res) {
    var accountRepository = req.sitepointsContext.accountRepository;
    var user = req.params.user;
    var accountRet = null;
    accountRepository.findAccountByUser(user).then(function (account) {
        accountRet = account;
        if(!accountRet){
            $responseUtils.notFoundError(res, "");
            return;
        }
        return $apikeyService.generate(accountRet);
    }).then(function(apikey){
        accountRet.apikey = accountRet._id + apikey ;
        accountRet.created = new Date(accountRet.created).toUTCString();
        delete accountRet.password;
        delete accountRet._id;
        res.send(accountRet);
    }).catch(function(err){
        $responseUtils.internalServerError(res, err);
    })
}]);


$router.post('/', function (req, res) {
    var accountRepository = req.sitepointsContext.accountRepository;
    var account = req.body;

    if(!validateAccountSchema(account)){
        $responseUtils.badRequestError(res, "Account needs at least 'firstName','lastName','domain','user','password'");
    }

    accountRepository.findAccountByUser(account.user).then(function(userAccount){
        if(!userAccount){
            return accountRepository.createAccount(account);
        }
        else{
            $responseUtils.conflictError(res,"Account for user '" + userAccount.user + "' already exists");
        }
    }).then(function(account){
        $responseUtils.created(res, {
            id: account._id.toString()
        });
    }).catch(function(err){
        $responseUtils.internalServerError(res,err);
    })

});


module.exports = $router;
