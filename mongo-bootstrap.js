/**
Bootstrapper for sitepoints mongodb
*/

print('-----------------------\nSitepoints MongoDB Bootstrapper\n-----------------------');

var bootStrapper = new function(){
    var SITE_URL = 'www.devbutze.com/sitepoints/bootstrap';
    var USER_NAME = 'sitepoints';

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

        var hasSites =  collections.indexOf('sites') >= 0;
        var hasSitepoints =  collections.indexOf('sitepoints') >= 0;
        var hasUser = db.getUser(USER_NAME) != null;

        print("Collection 'sitepoints':" + (hasSitepoints ? "[OK]" : "[FAIL]") );
        print("Collection 'sitepoints':" + (hasSitepoints ? "[OK]" : "[FAIL]") );
        print("User '" + USER_NAME + "':" + (hasUser ? "[OK]" : "[FAIL]") );

        if(hasSitepoints && hasSites && hasUser){
            printInfo("Your database is complete! Bootstrapping not necessary.");
            quit();
        }

        if(hasSitepoints || hasSites || hasUser) {
            printError("The database seems corrupted. It is recommended to drop the 'sitepoints' database and rerun the bootstrapper.");
            quit();
        }

    };
    
    var insertSite = function(siteurl){        
        
        db.sites.insert({         
            url : siteurl,
            created: Date.now()
        });

        db.sites.ensureIndex( { url : 1}, {unique : true});
        
        return db.sites.findOne( { url : siteurl} )._id;    
    };
    
    var insertRandomPoints = function(siteId, n){

        for(var i=0; i<n; ++i){
            var sitepoint = {
                site_id: siteId,
                created: Date.now(),
                x: 100 + (_rand() * 300) << 0,
                y: 100 + (_rand() * 300) << 0
            };
            db.sitepoints.insert( sitepoint );
        }

    };
    
    var countSitepoints = function(siteId){
        return db.sitepoints.count( {site_id : siteId});
    };
    
    var createSitepoints= function(siteId){
        print('Creating some test data...\n');
        
        insertRandomPoints(siteId, 3);
        insertRandomPoints(siteId, 5);    
        insertRandomPoints(siteId, 8);        
        
        print('...created ' +  countSitepoints(siteId) + ' sitepoints.'  );
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
        print('Creating site: ' + SITE_URL);
        var id = insertSite(SITE_URL);
        createSitepoints(id);
        createUser(USER_NAME, USER_NAME);
    };
};


bootStrapper.go();
