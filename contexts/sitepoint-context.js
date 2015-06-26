var $config = require('../config.js');

function SitepointsContext(){

    var connectionString = $config.database.connection;

    this.sitepointRepository = require('../repositories/sitepoint-repo').connect(connectionString);
    this.siteRepository = require('../repositories/site-repo').connect(connectionString);
    this.accountRepository = require('../repositories/account-repo').connect(connectionString);

}

module.exports = new SitepointsContext();