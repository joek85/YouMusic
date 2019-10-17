var express = require('express');
var router = express.Router();
var request = require('request');
var ytpl = require('ytpl');
var playlistquery = 'https://www.googleapis.com/youtube/v3/playlists';
var playlistitemsquery = 'https://www.googleapis.com/youtube/v3/playlistItems';
router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var playlistid = req.query['playlistId'];
    console.log(playlistid);
    ytpl(playlistid, function(err, playlist) {
        if(err){
            console.log(err);
            res.json(err)
        }else{
            //console.log(playlist);
            res.json(playlist)
        }
    });

});
router.get('/playlistitems', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var playlist = req.query['playlistId'];
    console.log(playlist);


});
module.exports = router;