describe("Account Repository", function(){
    var accountRepo = require('../../repositories/account-repo');
    var config = require('../helpers/spec-config');

    beforeAll(function() {
       accountRepo.connect(config.database.connection);
    });

    it("returns a specific account by username", function(done) {
        accountRepo.findAccountByUser("ohager").then(
            function(account){
                expect(account.username).toBe("ohager");
                expect(account.domain).toBe("devbutze.com");
            }
        ).catch(function(err){expect(err).toBeUndefined();})
            .finally(done);
    });

    it("returns a specific account by domain", function(done) {
        accountRepo.findAccountByDomain("devbutze.com").then(
            function(account){
                expect(account.username).toBe("ohager");
                expect(account.domain).toBe("devbutze.com");
            }
        ).catch(function(err){expect(err).toBeUndefined();})
            .finally(done);
    });

});