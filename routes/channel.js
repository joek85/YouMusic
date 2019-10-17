var express = require('express');
var router = express.Router();
var request = require('request');
var YoutubeGrabber = require('youtube-grabber-js');

var channelquery = 'https://www.youtube.com/channel/';


router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var channelURL = req.query['channelId'];
    console.log(channelquery + channelURL);
    YoutubeGrabber.getChannelInfo(channelquery + channelURL, {
        videos: true,
        playlists: true
    }).then(function(result){
        //console.log(result); // Now you can use res everywhere
        res.json(result)
    });


});
router.get('/channelsection', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var channel = req.query['channelId'];
    console.log(channel);


});
module.exports = router;