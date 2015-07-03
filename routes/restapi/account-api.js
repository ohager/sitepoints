var $responseUtils = require('../../utils/response-utils');
var $authInterceptor = require('../../utils/auth-interceptor');
var $express = require('express');
var $router = $express.Router();

function validateAccountSchema(account) {
    return account.lastName && account.firstName && account.domain && account.user;
}

// ------------------------------------- QUERIES ------------------------------------------------


$router.get('/', function (req, res) {
    res.send('Account API - Implement me');
});

$router.get('/:user', function (req, res) {
    var accountRepository = req.sitepointsContext.accountRepository;
    var user = req.params.user;
    accountRepository.findAccountByUser(user).then(function(account){
        res.send(account);
    }).catch(function(err){
        $responseUtils.internalServerError(res, err);
    })

});


$router.post('/', function (req, res) {
    var accountRepository = req.sitepointsContext.accountRepository;
    var account = req.body;

    if(!validateAccountSchema(account)){
        $responseUtils.badRequestError(res, "Account needs at least 'firstName','lastName','domain','user'");
    }

    accountRepository.findAccountByUser(account.user).then(function(accounts){
        if(accounts.length === 0){
            return accountRepository.createAccount(account);
        }
        else{
            $responseUtils.conflictError(res,"Account for user '" + account.user + "' already exists");
        }
    }).then(function(account){
        $responseUtils.created(res,account._id.toString());
    }).catch(function(err){
        $responseUtils.internalServerError(res,err);
    })

});


module.exports = $router;
