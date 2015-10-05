var $config = require('../config');



function ResponseUtils(){

    this.internalServerError = function(res, err){
        var errMsg = $config.debugMode ? err : "Ask your admin!";
        res.status(500).send('Internal Server Error: ' + errMsg).end();
    };

    this.conflictError = function(res, err){
        res.status(409).send(err).end();
    };

    this.badRequestError = function(res, err){
        res.status(400).send(err).end();
    };

    this.forbiddenError = function(res, err){
        res.status(403).send(err).end();
    };

    this.unauthorizedError = function(res, err){
        res.status(401).send(err).end();
    };

    this.notFoundError = function(res, err){
        res.status(404).send(err).end();
    };

    this.created = function(res,id){
        res.status(201).send(id).end();
    };


    this.noContent = function(res){
        res.status(204).end();
    };

    this.ok = function(res, data){
        res.status(200).send(data).end();
    };
}

module.exports = new ResponseUtils();
