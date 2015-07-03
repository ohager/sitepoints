/**
 * Created by oliver on 20.11.2014.
 */
var $express = require('express');
var $router = $express.Router();

$router.get('/site/all', function (req, res) {

    // TODO: Remove mocked result
    var MOCKED_ITEM_COUNT = 20;
    var result = [];
    for(var i=0; i<MOCKED_ITEM_COUNT; ++i){
        result.push(
            {
                site : 'www.devbutze.com/test/' + i,
                created : new Date(2014, i%10, i%28).toISOString(),
                counts : 1234
            }
        )
    }

    res.send(JSON.stringify(result));

});

module.exports = $router;
