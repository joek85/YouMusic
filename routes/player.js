var express = require('express');
var router = express.Router();
var request = require('request');
//var ytdl = require('youtube-dl');
var fs = require('fs');
var mediadir = process.cwd() + '/media/';
var playerquery = 'https://www.googleapis.com/youtube/v3/videos';
var relatedquery = 'https://www.googleapis.com/youtube/v3/search';
var videourl = 'https://www.youtube.com/watch?v=';
const ytdl = require('ytdl-core');
router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var id = req.query['id'];
    console.log('Process id ' + id);
    var sql = 'SELECT * FROM infos WHERE id = ?';
    // query(sql,[id],function (err, result) {
    //     'use strict';
    //     if(result && result.length){
    //         var rows = JSON.parse(JSON.stringify(result[0]));
    //         var out = [{id: rows.id, channel_id: rows.channel_id, title: rows.title, subtitle: rows.channel_name, thumbnail: rows.thumbnail, duration: rows.duration_hms, play_counts: rows.play_counts, published_at: rows.published_at,
    //             description: rows.description, tags: JSON.parse(rows.tags), played: rows.played}];
    //         //console.log(out);
    //         res.json(out)
    //     }else{
    //         request.get({url:playerquery ,json: true, qs: {
    //             part: 'snippet,contentDetails,statistics',
    //             type: 'video',
    //             videoCategoryId: '10',
    //             id: id,
    //             fields:'items(contentDetails(duration),id,snippet(channelId,channelTitle,description,publishedAt,tags,thumbnails,title),statistics(viewCount))',
    //             key:'AIzaSyAIcY4I-8xigi1hK9n_W37652lAXbym2pM'}}, function(error, response, body) {
    //             if(error){
    //                 console.log(error);
    //                 res.json(error)
    //             }else{
    //                 // console.log(body.items[0].snippet.title);
    //                 // console.log(body.items[0].snippet.channelTitle);
    //                 // console.log(body.items[0].snippet.thumbnails.maxres !== undefined ? body.items[0].snippet.thumbnails.maxres.url : body.items[0].snippet.thumbnails.high.url);
    //                 // console.log(body.items[0].contentDetails.duration);
    //                 // console.log(body.items[0].statistics.viewCount);
    //                 // console.log(body.items[0].snippet.publishedAt);
    //                 // console.log(body.items[0].snippet.description);
    //                 // console.log(body.items[0].snippet.tags);
    //                 //console.log(JSON.stringify(body));
    //                 database_insert_item_infos(id,body.items[0].snippet.channelId,body.items[0].snippet.title,body.items[0].snippet.channelTitle,body.items[0].snippet.thumbnails.maxres !== undefined ? body.items[0].snippet.thumbnails.maxres.url : body.items[0].snippet.thumbnails.high.url,
    //                     body.items[0].contentDetails.duration,body.items[0].statistics.viewCount,body.items[0].snippet.publishedAt,
    //                     body.items[0].snippet.description, body.items[0].snippet.tags);
    //
    //                 var out = [{id: id, title: body.items[0].snippet.title, subtitle: body.items[0].snippet.channelTitle, thumbnail: body.items[0].snippet.thumbnails.maxres !== undefined ? body.items[0].snippet.thumbnails.maxres.url : body.items[0].snippet.thumbnails.high.url,
    //                     duration: body.items[0].contentDetails.duration, play_counts: body.items[0].statistics.viewCount, published_at: body.items[0].snippet.publishedAt,
    //                 description: body.items[0].snippet.description, tags: body.items[0].snippet.tags, channel_id: body.items[0].snippet.channelId, played: 0}];
    //                 res.json(out)
    //             }
    //         });
    //     }
    // });
    ytdl.getInfo(videourl + id, function getInfo(err, info) {
        'use strict';
        if (err) {
            console.log(err);
            res.json(err)
        }else{
            var videodetails = info.player_response.videoDetails;
            var formats = ytdl.filterFormats(info.formats, 'audioonly');
            var related = info.related_videos;
            var out = [{id: id, title: videodetails.title, subtitle: videodetails.author, thumbnail: videodetails.thumbnail.thumbnails[0],
                duration: videodetails.lengthSeconds, play_counts: videodetails.viewCount, published_at: info.published,
                description: videodetails.shortDescription, tags: videodetails.keywords, channel_id: videodetails.channelId,
                formats: parseFormats(formats), related: related}];
            //console.log((out));
            console.log(videodetails.thumbnail.thumbnails[0].url.split('hqdefault')[0] + 'maxresdefault.jpg');
            console.log(videodetails.thumbnail.thumbnails);
            res.json(out)
        }
    });
});
router.get('/mostpopular', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var nextPageToken = req.query['nexttoken'];

    request.get({url:playerquery ,json: true, qs: {
        part: 'snippet,contentDetails,statistics',
        type: 'video',
        videoCategoryId: '10',
        chart: 'mostPopular',
        regionCode: 'US',
        maxResults: '50',
        pageToken:nextPageToken !== undefined ? nextPageToken : '',
        key:'AIzaSyAIcY4I-8xigi1hK9n_W37652lAXbym2pM'}}, function(error, response, body) {
        if(error){
            console.log(error);
            res.json(error)
        }else{
            //console.log(body);
            res.json(body)
        }
    });
});
router.get('/related', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var nextPageToken = req.query['nexttoken'];
    var id = req.query['id'];
    // console.log(nextPageToken);
    // console.log(id);
    request.get({url:relatedquery ,json: true, qs: {
        part: 'snippet',
        type: 'video',
        videoCategoryId: '10',
        relatedToVideoId: id,
        maxResults: '30',
        pageToken:nextPageToken !== undefined ? nextPageToken : '',
        fields:'items/id/videoId,nextPageToken',
        key:'AIzaSyAIcY4I-8xigi1hK9n_W37652lAXbym2pM'}}, function(error, response, body) {
        if(error){
            res.json(error)
        }else{
            //console.log(body);
            res.json(body)
        }
    });
});
router.get('/media', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var id = req.query['id'];
    var user = req.query['user'];
    var d = req.query['d'];

    // req.headers['x-forwarded-host'] = '185.11.161.85';
    // req.headers['x-forwarded-server'] = '185.11.161.85';
    // req.headers['x-forwarded-for'] = '185.11.161.85';
    // req.headers['X-Real-IP'] = '185.11.161.85';
    console.log('id = ' + id);
    console.log('user = ' + user);
    console.log('date = ' + d);
    if(user !== null && user !== undefined){
        database_insert_item(user,id,d)
    }
    if(fs.existsSync(mediadir + id)){
        var sql = 'SELECT title FROM infos WHERE id = ?';
        query(sql,[id],function (err, result) {
            'use strict';
            if(result && result.length){
                var rows = JSON.parse(JSON.stringify(result[0]));
                var title = rows.title + '(320Kbps).mp3';
                if(fs.existsSync(mediadir + id + '/' + title)){
                    res.json({mp3: 'http://localhost:3000/medias/' + id + '/' + title})
                }
                //console.log(out);
            }else{
                // re download
            }
        });
    }else{
        ytdl.getInfo(videourl + id, function getInfo(err, info) {
            'use strict';
            if (err) {
                console.log(err);
                res.json(err)
            }else{
                //console.log(info.formats);
                var len = info.formats.length;
                var formats = [];
                var i = 0;
                while (--len){
                    if(info.formats[i].width || info.formats[i].height){
                        break
                    }else{
                        formats.push({itag: info.formats[i].format_id, url: info.formats[i].url})
                    }
                    i++;
                }
                //var formats = { id: info.id, formats: info.formats.map(mapInfo) };
                //console.log(formats);
                //res.json({mp3:formats.formats[4].url})
                //console.log(Math.max.apply(null, formats.map(mapI)));
                var results = formats.filter(function( obj ) {
                    var v = Math.max.apply(null, formats.map(mapI));
                    return parseInt(obj.itag) === parseInt(v);
                });
                console.log(results);
                if(results.length > 0){
                    //var file = fs.createWriteStream(dir + id + '.mp3');
                    // request.get({url:results[0].url}, function(error, response, body) {
                    //     body.pipe(file);
                    //     res.json({mp3: 'http://localhost:3000/' + file})
                    //     //console.log(response)
                    // });
                    // request
                    //     .get(results[0].url)
                    //     .on('response', function(response) {
                    //         console.log(response.statusCode); // 200
                    //         console.log(response.headers['content-type']); // 'image/png'
                    //         console.log(response.headers['content-length']);
                    //         console.log(response.headers);
                    //         // res.header({
                    //         //     'Content-Type': response.headers['content-type'],
                    //         //     'Content-Length': response.headers['content-length']
                    //         // });
                    //         // res.writeHead(200, { 'Content-Length': response.headers['content-length'],
                    //         //     'Content-Type': response.headers['content-type'],
                    //         //     "Content-Range": "bytes " + 0 + "-" + 100000 + "/" + response.headers['content-length'],
                    //         //     "Accept-Ranges": "bytes"});
                    //         res.sendFile(response)
                    //     })
                    //.pipe(res)
                    //req.pipe(request.get(results[0].url)).pipe(res);
                    //res.json({mp3: 'http://localhost:3000/' + file});
                    // sendReq.on('response', function(response) {
                    //     if (response.statusCode !== 200) {
                    //         console.log('Response status was ' + response.statusCode);
                    //     }else{
                    //         console.log('Response' + response.statusCode);
                    //     }
                    // });
                    //req.pipe(results[0].url).pipe(file).json({mp3: 'http://localhost:3000/' + file});
                    res.json({mp3: results[0].url})
                }else {
                    res.json({mp3: ''})
                }

            }
        });
    }


    // request.get({url:'https://www.youtube.com/get_video_info?video_id=' + id ,json: true, headers: {origin: '184.72.174.102'}}, function(error, response, body) {
    //     if (error) {
    //         console.log(error);
    //         //res.json(error)
    //     }else{
    //         var pizza = parse_str(body);
    //         var streams = (pizza.url_encoded_fmt_stream_map + ',' + pizza.adaptive_fmts).split(',');
    //         for (let i = 0; i < streams.length; i++) {
    //         console.log(parse_str(streams[i]));
    //         }
    //         console.log(body);
    //         //console.log(body)
    //         //res.json('hi')
    //     }
    // });
    // axios.get('https://cors-anywhere.herokuapp.com/https://www.youtube.com/get_video_info?video_id=' + t.id)
    // .then(function (response) {
    //  let pizza = playerservice.parse_str(response.data)
    //  let streams = (pizza.url_encoded_fmt_stream_map + ',' + pizza.adaptive_fmts).split(',')
    //  // for (let i = 0; i < streams.length; i++) {
    //  console.log(playerservice.parse_str(streams[streams.length - 1]))
    //  // }
    //  t.$store.dispatch('commitAudioPlayerUrl', playerservice.parse_str(streams[streams.length - 1]).url)
    //  t.$store.dispatch('commitFooterVisibility', 'visible')
    //  t.$store.dispatch('commitAudioPlayerId', t.id)
    // })
    // .catch(function (err) {
    //  console.log(err)
    // })
});
router.get('/updateplayed', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var id = req.query['id'];
    var played = req.query['played'];

    // req.headers['x-forwarded-host'] = '185.11.161.85';
    // req.headers['x-forwarded-server'] = '185.11.161.85';
    // req.headers['x-forwarded-for'] = '185.11.161.85';
    // req.headers['X-Real-IP'] = '185.11.161.85';
    console.log('id = ' + id);
    console.log('played = ' + played);
    database_update_item(id,played);
    res.json('done');
});
function parse_str (str) {
    return str.split('&').reduce(function (params, param) {
        var paramSplit = param.split('=').map(function (value) {
            return decodeURIComponent(value.replace('+', ' '))
        });
        params[paramSplit[0]] = paramSplit[1];
        return params
    }, {})
}
function database_insert_item(_userid, _mediaid, d) {
    var data = {user_id: _userid, media_id:_mediaid, date:d};
    var sql = 'INSERT INTO history SET ?';
    query(sql,[data],function (err, result) {
        if(err){
            console.log(err)
        }else{
            //console.log(result);
        }
    });
}
function database_insert_item_infos(_id,_channelid, _title, _chan, _thumb, _dur, _plays, _pub, _desc, _tags) {
    var data = {id:_id, channel_id: _channelid, title:_title, channel_name:_chan, thumbnail:_thumb, duration_hms:_dur, play_counts:_plays, published_at: _pub, description: _desc, tags: JSON.stringify(_tags)};
    var sql = 'INSERT INTO infos SET ?';
    query(sql,[data],function (err, result) {
        if(err){
            console.log(err)
        }else{
             //console.log(result);
        }
    });
}
function database_update_item(id, played) {
    var data = {played: played};
    var data2 = {id: id};
    var sql = 'UPDATE infos SET ? WHERE ?';
    query(sql,[data, data2],function (err, result) {
        if(err){
            console.log(err)
        }else{
            //console.log(result);
        }
    });
}
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
function mapInfo(item) {
    'use strict';
    return {
        itag: item.format_id,
        filetype: item.ext,
        resolution: item.resolution || ((item.width) ? item.width + 'x' + item.height : 'audio only'),
        url: item.url
    };
}
function mapI(item) {
    'use strict';
    return item.itag
}
function filterBlocked(items) {
    var sql = 'SELECT * FROM blocked';
    query(sql,function (err, result) {
        if(result && result.length){
            var rows = JSON.parse(JSON.stringify(result[0]));
            for (var i = 0; rows.length; i++){

            }
        }
    });
}
function parseRelated(related) {
    var items = [];
    for ( var i = 0; i < related.length; i++ ) {
        items.push({id: related[i].id, title : related[i].title, subtitle: related[i].author, duration: related[i].length_seconds, play_counts: related[i].short_view_count_text, thumbnail: related[i].iurlmq.split('?'[0])})
    }
    return items
}
function parseFormats(formats) {
    var len = formats.length;
    var i = 0;
    while (--len){
        if(formats[i].width || formats[i].height){
            break
        }else{
            formats.push({itag: formats[i].itag, url: formats[i].url})
        }
        i++;
    }
    var results = formats.filter(function( obj ) {
        var v = Math.max.apply(null, formats.map(mapI));
        return parseInt(obj.itag) === parseInt(v);
    });
    //console.log(results);
    // if(results.length > 0){
    //     res.json({mp3: results[0].url})
    // }else {
    //     res.json({mp3: ''})
    // }
    return results[1] !== '' ? results[1] : ''
}
module.exports = router;