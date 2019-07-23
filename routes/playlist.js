var express = require('express');
var router = express.Router();
var request = require('request');

var playlistquery = 'https://www.googleapis.com/youtube/v3/playlists';
var playlistitemsquery = 'https://www.googleapis.com/youtube/v3/playlistItems';
router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var playlist = req.query['playlistId'];
    console.log(playlist);
    request.get({url:playlistquery ,json: true, qs: {
        part: 'snippet,contentDetails',
        id: playlist,
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
router.get('/playlistitems', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var playlist = req.query['playlistId'];
    console.log(playlist);
    request.get({url:playlistitemsquery ,json: true, qs: {
        part: 'snippet,contentDetails',
        playlistId: playlist,
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