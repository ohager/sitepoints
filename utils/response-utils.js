
function ResponseUtils(){

    this.internalServerError = function(res, err){
        res.status(500).send('Internal Server Error: ' + err);
    };

    this.badRequestError = function(res, err){
        res.status(400).send('Bad Request: ' + err);
    };
}

module.exports = new ResponseUtils();
