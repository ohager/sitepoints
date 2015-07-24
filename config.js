module.exports = {
    database : {
        //connection :'mongodb://sitepoints:sitepoints@localhost:27017/sitepoints'
        connection :'mongodb://localhost:27017/sitepoints'
    },
    apiKeyRequired : false,
    auth : {
        tokenExpiry : 60 * 10 // 10 minutes
    }
};