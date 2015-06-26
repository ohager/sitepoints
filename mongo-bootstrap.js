/**
Bootstrapper for sitepoints mongodb
*/

print('-----------------------\nSitepoints MongoDB Bootstrapper\n-----------------------');

var bootStrapper = new function(){
    var USER_NAME = 'sitepoints';

    var ACCOUNT = {
        firstName : "Oliver",
        lastName : "Häger",
        domain : "devbutze.com",
        username : "ohager",
        created: Date.now()
    };

    var printError = function(message){
        print("\n###ERROR: " + message + "\n");
        quit();
    };
    
    var printInfo = function(message){
        print("\n###INFO: " + message + "\n");        
    };


    var assertMinimumVersion = function(minversion){
        if(/\d*\.\d*/.exec(version())[0] < minversion){
            printError('You need at least version <' + minversion + '> of MongoDB');
        }
    };
    
    var assertNotAppliedYet = function(){
        
        var collections = db.getCollectionNames();

        var hasAccounts =  collections.indexOf('accounts') >= 0;
        var hasSitepoints =  collections.indexOf('sitepoints') >= 0;
        var hasUser = db.getUser(USER_NAME) != null;

        print("Collection 'sitepoints':" + (hasSitepoints ? "[OK]" : "[FAIL]") );
        print("Collection 'accounts':" + (hasAccounts ? "[OK]" : "[FAIL]") );
        print("User '" + USER_NAME + "':" + (hasUser ? "[OK]" : "[FAIL]") );

        if(hasSitepoints && hasAccounts && hasUser){
            printInfo("Your database is complete! Bootstrapping not necessary.");
            quit();
        }

        if(hasSitepoints || hasAccounts || hasUser ) {
            printError("The database seems corrupted. It is recommended to drop the 'sitepoints' database and rerun the bootstrapper.");
            quit();
        }

    };

    var insertAccount = function(){

        db.accounts.insert(ACCOUNT);
        db.accounts.ensureIndex( { domain: 1}, {unique : true});
        db.accounts.ensureIndex( { username: 1}, {unique : true});

        return db.accounts.findOne( { domain : ACCOUNT.domain } )._id;
    };

    var insertRandomPoints = function(accountId, url, n){
        for(var i=0; i<n; ++i){
            var sitepoint = {
                account_id: accountId,
                url: url,
                created: Date.now(),
                x: 100 + (_rand() * 300) << 0,
                y: 100 + (_rand() * 300) << 0
            };
            db.sitepoints.insert( sitepoint );
        }
    };
    
    var countSitepoints = function(accountId){
        return db.sitepoints.count( {account_id : accountId});
    };
    
    var createSitepoints= function(accountId){
        print('Creating some test data...\n');
        
        insertRandomPoints(accountId, "http://www.devbutze.com/sitepoints", 3);
        insertRandomPoints(accountId, "http://www.devbutze.com/sitepoints/page1", 5);
        insertRandomPoints(accountId, "http://www.devbutze.com/sitepoints/page2/sub3", 8);
        
        print('...created ' +  countSitepoints(accountId) + ' sitepoints.'  );
    };

    var createUser = function (username, password) {
        print('Creating user...\n');
        db.createUser(
            {
                user: username,
                pwd: password,
                roles: [ { role: "readWrite", db: "sitepoints"} ]
            }
        );
        print('...created [' + username + ']' );
    };

    this.go = function(){
        
        db = db.getSiblingDB('sitepoints');  
        
        assertMinimumVersion(2.6);
        assertNotAppliedYet();
        print('Creating Account: ' + JSON.stringify(ACCOUNT));
        var accountId = insertAccount();
        createSitepoints(accountId);
        createUser(USER_NAME, USER_NAME);
    };
};


bootStrapper.go();
