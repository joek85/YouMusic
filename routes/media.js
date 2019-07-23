var express = require('express');
var router = express.Router();
var ytdl = require('youtube-dl');
var execFile = require('child_process').execSync;
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var url = 'https://www.youtube.com/watch?v=';
var dir = process.cwd() + '/media/';
var mp3 = require('../controllers/mp3Controller');

router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");

    var _id = req.query['id'];
    if(_id){
        var sqlhistory = 'INSERT INTO history SET ?';
        var historydata = {user_email:'mr.joey75@gmail.com', id:_id};
        query(sqlhistory,[historydata], function (err, result) {
            if(err){
                console.log(err)
            }
        });
        var sqlmedia = 'SELECT * FROM media WHERE id = ?';
        query(sqlmedia,[_id], function(err, result) {
            if(!err){
                ytdl.getInfo(url + _id, function getInfo(err, info) {
                    'use strict';
                    if (err) { console.log(err) }
                    var formats = { id: info.id, formats: info.formats.map(mapInfo) };
                    console.log(formats.formats[0].itag);
                    info.formats.forEach(function(zabre) {
                        var itag = zabre.format_id * 1,
                            quality = false;
                        //console.log(itag);
                        switch (itag) {
                            case 139:
                                quality = "48kbps";
                                break;
                            case 171:
                                quality = "128kbps";
                                break;
                            case 141:
                                quality = "256kbps";
                                break;
                        }
                        //if (quality) audio_streams[quality] = stream.url;
                    });
                    res.json({mp3:formats.formats[4].url})
                });
                // if(result && result.length){
                //     if(fs.existsSync(dir + _id)){
                //         var rows = JSON.parse(JSON.stringify(result[0]));
                //         res.json({
                //             waveform: 'http://localhost:3000/' + _id + '/' + _id + '.png',
                //             mp3: rows.url
                //         });
                //         //console.log(rows)
                //     }
                // }else{
                //     //mkdirp.sync(dir + _id);
                //     // ytdl.getInfo(url+_id, function(err, info) {
                //     //     'use strict';
                //     //     if(!err){
                //     //         console.log('id:', info.id);
                //     //         console.log('title:', info.title);
                //     //         console.log('url:', info.url);
                //     //         console.log('thumbnail:', info.thumbnail);
                //     //         console.log('filename:', info._filename);
                //     //         console.log('duration:', info.duration);
                //     //         console.log('raw duration:', info._duration_raw);
                //     //         console.log('duration hms:', info._duration_hms);
                //     //         console.log('format_id:', info.format_id);
                //     //
                //     //         var sql = 'INSERT INTO media SET ?';
                //     //         insert(sql, _id, info.title, info.url, info.thumbnail, info._filename, info.duration, info._duration_raw, info._duration_hms, info.format_id);
                //     //         var wave = dir + _id + '/' + _id + '.mp3';
                //     //         'use strict';
                //     //         ytdl.exec(url+_id, ['-x','--no-part', '--write-all-thumbnails', '--no-post-overwrites', '--audio-format', 'mp3', '--audio-quality', '0', '--embed-thumbnail', '-o', dir + _id +'/%(id)s.%(ext)s'], {}, function exec(err, output) {
                //     //             'use strict';
                //     //             if(!err){
                //     //                 console.log(output.join('\n'));
                //     //                 execFile(process.cwd()+'/bass/pngspec/pngspec -f '+ wave + ' -o ' + dir + _id + '/' + _id + '.png', {}, function error(err, stdout, stderr) {
                //     //                     console.log(err);
                //     //                     console.log(stderr);
                //     //                     console.log(stdout);
                //     //                 });
                //     //
                //     //                 res.json({
                //     //                     waveform: 'http://localhost:3000/' + _id + '/' + _id + '.png',
                //     //                     mp3: 'http://localhost:3000/' + _id + '/' + _id + '.mp3'
                //     //                 });
                //     //             }
                //     //         });
                //     //     }
                //     // });
                // }
            }else{
                console.log(err);
                req.json('hi');
            }
        });
    }else{
        res.json('error')
    }
    // if (_id){
    //     var wave = dir + _id + '/' + _id + '.mp3';
    //     if(fs.existsSync(dir + _id)){
    //         res.json({
    //             waveform: 'http://192.168.1.100:3000/' + _id + '/' + _id + '.png',
    //             mp3: 'http://192.168.1.100:3000/' + _id + '/' + _id + '.mp3'
    //         });
    //     }else{
    //         mkdirp.sync(dir + _id);
    //         ytdl.getInfo(url+_id, function(err, info) {
    //
    //             'use strict';
    //             //if (err) { throw err; }
    //
    //             console.log('id:', info.id);
    //             console.log('title:', info.title);
    //             console.log('url:', info.url);
    //             console.log('thumbnail:', info.thumbnail);
    //             console.log('filename:', info._filename);
    //             console.log('duration:', info.duration);
    //             console.log('raw duration:', info._duration_raw);
    //             console.log('duration hms:', info._duration_hms);
    //             console.log('format_id:', info.format_id);
    //         });
    //         'use strict';
    //         ytdl.exec(url+_id, ['-x','--no-part', '--write-all-thumbnails', '--no-post-overwrites', '--audio-format', 'mp3', '--audio-quality', '0', '--embed-thumbnail', '-o', dir + _id +'/%(id)s.%(ext)s'], {}, function exec(err, output) {
    //             'use strict';
    //             //if (err) { throw err; }
    //             if(output){
    //                 console.log(output.join('\n'));
    //                 execFile(process.cwd()+'/bass/pngspec/pngspec -f '+ wave + ' -o ' + dir + _id + '/' + _id + '.png', {}, function error(err, stdout, stderr) {
    //                     console.log(err);
    //                     console.log(stderr);
    //                     console.log(stdout);
    //                 });
    //
    //                 res.json({
    //                     waveform: 'http://192.168.1.100:3000/' + _id + '/' + _id + '.png',
    //                     mp3: 'http://192.168.1.100:3000/' + _id + '/' + _id + '.mp3'
    //                 });
    //             }
    //         });
    //     }
    // }
});
// function mapInfo(item) {
//     'use strict';
//     return {
//         itag: item.format_id,
//         filetype: item.ext,
//         resolution: item.resolution || ((item.width) ? item.width + 'x' + item.height : 'audio only')
//     };
// }
router.get('/audio/:id', function(req, res, next) {
    //res.setHeader("Access-Control-Allow-Origin", "hellojoe");
    var _id = req.params.id;
    console.log(_id);

    res.json({
        mp3: 'http://localhost:3000/' + _id + '/' + _id + '.mp3'
    });
});
function mapInfo(item) {
    'use strict';
    return {
        itag: item.format_id,
        filetype: item.ext,
        resolution: item.resolution || ((item.width) ? item.width + 'x' + item.height : 'audio only'),
        url: item.url
    };
}
function insert(sql, _id, _title, _url, thumbnail, _filename, duration, _duration_raw,_duration_hms, format_id) {
    var data = {id: _id, title:_title, url:_url, thumbnail:thumbnail, filename:_filename, duration:duration, duration_raw:_duration_raw,duration_hms:_duration_hms, format_id:format_id};

    query(sql,data,function (err, result) {
        console.log(result);
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
var checkMP3 = function (id) {
    return fs.existsSync(dir + id + '/' + id + '.mp3');
};
var checkPNG = function (id) {
    return fs.existsSync(dir + id + '/' + id + '.png');
};
var checkJPG = function (id) {
    return fs.existsSync(dir + id + '/' + id + '.jpg');
};
module.exports = router;
