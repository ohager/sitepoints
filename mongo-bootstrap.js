/**
Bootstrapper for sitepoints mongodb
*/

print('-----------------------\nSitepoints MongoDB Bootstrapper\n-----------------------');

var bootStrapper = new function(){
    var SITE_URL = 'www.devbutze.com/sitepoints/bootstrap';

    var printError = function(message){
        print("\n###ERROR: " + message + "\n");
        quit();
    }
    
    var printInfo = function(message){
        print("\n###INFO: " + message + "\n");        
    }


    var assertMinimumVersion = function(minversion){
        if(/\d*\.\d*/.exec(version())[0] < minversion){
            printError('You need at least version <' + minversion + '> of MongoDB');
        }
    }
    
    var assertNotAppliedYet = function(){
        
        var collections = db.getCollectionNames();
        
        if(collections.length === 0) return;
        
        printInfo("Found the following collections:")
        collections.forEach( function(collectionName){
            print(collectionName + ( collectionName === 'sitepoints' || collectionName === 'sites' ? ' [ok]' : ''));
        })
        
        var hasSites =  collections.indexOf('sites') >= 0;
        var hasSitepoints =  collections.indexOf('sitepoints') >= 0;
        
        if(hasSitepoints && hasSites){
            var site = db.sites.findOne({url : SITE_URL});
            var totalSitepoints =  countSitepoints(site._id);
            printInfo("Your database is complete! Bootstrapping not necessary.");
            quit();
        }
        
        if(hasSitepoints || hasSites){
            printError("The database seems corrupted. To run the bootstrapper ensure that neither the collection 'sitepoints' nor 'sites' exist.");
            quit();            
        }    
        
    }
    
    var insertSite = function(siteurl){        
        
        db.sites.insert({         
            url : siteurl,
            created: ISODate()
        });

        db.sites.ensureIndex( { url : 1}, {unique : true});
        
        return db.sites.findOne( { url : siteurl} )._id;    
    }
    
    var insertRandomPoints = function(siteId, n){
        
        var sitepoints = [];
        
        for(var i=0; i<n; ++i){
            sitepoints.push({
                created : ISODate(),
                x : 100 + (_rand() * 300)<<0,
                y : 100 + (_rand() * 300)<<0
            })
        }
        
        var dataset = {
            site_id : siteId,
            sitepoints : sitepoints
        };
        
        db.sitepoints.insert( dataset );        
    }
    
    var countSitepoints = function(siteId){
        var result = db.sitepoints.mapReduce(
            
            function(){ emit(this.site_id, {count: 0, points: this.sitepoints}) },
            
            function(key, values){                                       
                var reduced = {count:0, points: 0}
                
                for(var i=0; i<values.length; ++i){
                    reduced.count += values[i].points.length;                    
                }
                
                return reduced; },
            {
                query: {site_id : siteId},
                out : {inline : 1}
            }
        );
        
        return result.results[0] ? result.results[0].value.count : 0;
    }
    
    var createSitepoints= function(siteId){
        print('Creating some test data...\n');
        
        insertRandomPoints(siteId, 3);
        insertRandomPoints(siteId, 5);    
        insertRandomPoints(siteId, 8);        
        
        print('...created ' +  countSitepoints(siteId) + ' sitepoints.'  );
    }

    this.go = function(){
        
        db = db.getSiblingDB('sitepoints');  
        
        assertMinimumVersion(2.6);
        assertNotAppliedYet();
        print('Creating site: ' + SITE_URL);                
        var id = insertSite(SITE_URL);
        createSitepoints(id);
        
    }
}


bootStrapper.go();
