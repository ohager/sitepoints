
function ResponseUtils(){

    this.internalServerError = function(res, err){
        res.status(500).send('Internal Server Error: ' + err).end();
    };

    this.conflictError = function(res, err){
        res.status(409).send('Conflict : ' + err).end();
    };

    this.badRequestError = function(res, err){
        res.status(400).send('Bad Request: ' + err).end();
    };

    this.forbiddenError = function(re, err){
        res.status(403).send('Forbidden: ' + err).end();
    };

    this.created = function(res,id){
        res.status(201).send(id).end();
    };


    this.noContent = function(res){
        res.status(204).end();
    };

    this.ok = function(res){
        res.status(200).end();
    };
}

module.exports = new ResponseUtils();
