var express = require('express');
var router = express.Router();
var request = require('request');
var ytSearch = require('yt-search');
var ytdl = require('youtube-dl');
var searchvar = 'https://www.googleapis.com/youtube/v3/search';
const ytsr = require('ytsr');
let filter;
router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var query = req.query['q'];
    // console.log(query);
    // var nextPageToken = req.query['nexttoken'];
    // var output = [];
    // var opts = {
    //     query: query,
    //     pageStart: 1, // first youtube page result
    //     pageEnd: 3 // up until page 3
    // };
    // ytdl.exec(null,['--default-search','ytsearch20',query,'-s','-J'], {},function exec(err, info) {
    //     if(err){
    //         console.log(err)
    //     }else{
    //         console.log(info);
    //     }
    //     res.json('hi')
    // });
    // ytSearch( opts, function ( err, r ) {
    //     if ( typeof opts === 'string' ) {
    //         opts = {
    //             query: opts,
    //             pageStart: 1,
    //             pageEnd: 3
    //         }
    //     }
    //     //console.log(r);
    //     var items = [];
    //     for ( var i = 0; i < r.videos.length; i++ ) {
    //         //console.log(r.videos[i]);
    //         items.push({id: {videoId: r.videos[i].videoId}, title : r.videos[i].title, subtitle: r.videos[i].channel, duration: r.videos[i].timestamp, play_counts: r.videos[i].views, published_at: r.videos[i].ago, thumbnail: r.videos[i].thumbnail})
    //     }
    //     //output.push({items: items});
    //     console.log(items);
    //     res.json({items: items})
    // });

    ytsr.getFilters(query, function(err, filters) {
        if (err) throw err;
        filter = filters.get('Type').find(function(o){
            return o.name === 'Video'
        });
        var options = {
            limit: 30,
            nextpageRef: filter.ref
        };
        ytsr(null, options, function(err, searchResults) {
            if(err){
                res.json(err)
            }else{
                var results = parseresults(searchResults.items);
                //console.log(results);
                res.json(results)
            }

        });
    });
    // request.get({url:searchvar ,json: true, qs: {
    //     part: 'snippet',
    //     type: 'video',
    //     videoCategoryId: '10',
    //     q: query,
    //     maxResults: '25',
    //     fields:'items/id/videoId,nextPageToken,pageInfo/totalResults',
    //     pageToken:nextPageToken !== undefined ? nextPageToken : '',
    //     key:'AIzaSyAIcY4I-8xigi1hK9n_W37652lAXbym2pM'}}, function(error, response, body) {
    //     if(error){
    //         res.json(error);
    //         console.log(error)
    //     }else{
    //         //console.log(body);
    //         res.json(body)
    //     }
    // });

});
function parseresults(results) {
    var items = [];
    for ( var i = 0; i < results.length; i++ ) {
        items.push({id: {videoId: results[i].link.split('v=')[1]}, title : results[i].title, subtitle: results[i].author.name, duration: results[i].duration, play_counts: results[i].views, published_at: results[i].uploaded_at, thumbnail: results[i].thumbnail.split('?'[0])})
    }
    return items
}
router.get('/suggestion', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var text = req.query['text'];
    // console.log(text);
    var sql = 'SELECT title FROM infos WHERE title LIKE ? LIMIT 10';
    var sqlq = '%' + text + '%';
    query(sql,[sqlq],function (err, result) {
        'use strict';
        var rows = result;
        console.log(err);
        //console.log(rows);
        res.json(rows)
    });
});
function query(sql, data, callback) {
    pool.getConnection(function(err, connection) {
        // Use the connection
        connection.query(sql,data, function (error, results, fields) {
            // And done with the connection.
            callback(error,results,fields);
            connection.release();
        });
    });
}
module.exports = router;