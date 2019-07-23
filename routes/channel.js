var express = require('express');
var router = express.Router();
var request = require('request');

var channelquery = 'https://www.googleapis.com/youtube/v3/channels';
var channelsectionquery = 'https://www.googleapis.com/youtube/v3/channelSections';

router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var channel = req.query['channelId'];
    console.log(channel);
    request.get({url:channelquery ,json: true, qs: {
        part: 'snippet,contentDetails',
        id: channel,
        key:'AIzaSyAIcY4I-8xigi1hK9n_W37652lAXbym2pM'}}, function(error, response, body) {
        if(error){
            console.log(error);
            res.json(error)
        }else{
            console.log(body);
            res.json(body)
        }
    });

});
router.get('/channelsection', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var channel = req.query['channelId'];
    console.log(channel);
    request.get({url:channelsectionquery ,json: true, qs: {
        part: 'snippet,contentDetails',
        channelId: channel,
        key:'AIzaSyAIcY4I-8xigi1hK9n_W37652lAXbym2pM'}}, function(error, response, body) {
        if(error){
            console.log(error);
            res.json(error)
        }else{
            console.log(body);
            res.json(body)
        }
    });

});
module.exports = router;