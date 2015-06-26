var $q = require("q");
var BaseRepository = require("./base-repo");

function AccountRepository(){

    this.findAccountByUsername = function(username){
        var deferred = $q.defer();

        mongodb.accounts.findOne({
            'username': username
        }, function (err, account) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(account)
            }
        });

        return deferred.promise;
    };

    this.findAccountByDomain = function(domain){
        var deferred = $q.defer();

        mongodb.accounts.findOne({
            'domain': domain
        }, function (err, account) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(account)
            }
        });

        return deferred.promise;
    }
}

AccountRepository.prototype = new BaseRepository("accounts");
AccountRepository.prototype.constructor = AccountRepository;

module.exports = new AccountRepository();