var $express = require('express');
var $router = $express.Router();

var verifyExists = function(res, obj, desc){
    if(!obj){
        res.status(404).send('Resource ' + (desc ? desc : '') + ' not found');
    }
};

var internalServerError = function(res, err){
    res.status(500).send('Internal Server Error: ' + err);
};


// ------------------------------------- QUERIES ------------------------------------------------


$router.get('/', function (req, res) {
    res.send('User API - Implement me');
});



module.exports = $router;
