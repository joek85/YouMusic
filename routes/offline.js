var express = require('express');
var router = express.Router();
var ytdl = require('youtube-dl');
var mkdirp = require('mkdirp');
var request = require('request');
var fs = require('fs');
var dir = process.cwd() + '/media/';
var videourl = 'https://www.youtube.com/watch?v=';
var execFile = require('child_process').exec;

router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var id = req.query['id'];
    console.log('id = ' + id);
    if(!fs.existsSync(dir + id)){
        mkdirp.sync(dir + id);
    }

    // ytdl.exec(videourl+id, ['-x','--no-part', '--write-all-thumbnails', '--no-post-overwrites', '--audio-format', 'mp3',
    //     '--audio-quality', bitrate + 'K', '--embed-thumbnail', '-o', dir + id +'/%(title)s' + '(' + bitrate + 'Kbps)' + '.%(ext)s', '--prefer-ffmpeg', '--postprocessor-args',
    //     '-metadata title="eh zabre" -metadata artist="eh zabre" -metadata album="eh zabre" ' +
    //     '-metadata composer="eh zabre" -metadata genre="eh zabre" -metadata copyright="eh zabre" ' +
    //     '-metadata album_artist="eh zabre" -metadata publisher="eh zabre" -metadata track="eh zabre"'], {}, function exec(err, output) {
    //     if(err) {
    //         console.log(err);
    //         res.json(err)
    //     }else{
    //         console.log(output);
    //        // res.json(output);
    //         res.json({
    //                 mp3: 'http://localhost:3001/' + id + '/' + title + '(' + bitrate + 'Kbps)' + '.mp3'
    //             });
    //     }
    // })
    // var sqlMedias = 'SELECT * FROM medias WHERE id = ? AND bitrate = ?';
    // query(sqlMedias,[id,bitrate], function (err, result) {
    //     if(err){
    //         res.json(err)
    //     }else{
    //         if(result && result.length){
    //             var rows = JSON.parse(JSON.stringify(result[0]));
    //             res.json({
    //                 mp3: 'http://localhost:3001/' + rows.path
    //             });
    //         }else{
    //             if(fs.existsSync(dir + id + '/' + id)){
    //                 execFile('ffmpeg -n -i '+ dir + id + '/' + id + ' -i '+ dir + id + '/img' + ' -map 0:0 -map 1:0 -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)"' + ' -f mp3 -ab ' + bitrate + 'k ' + dir + id + '/"' + title + '(' + bitrate + 'Kbps)' + '".mp3', {}, function error(err, stdout, stderr) {
    //                     if(err){
    //                         console.log(err);
    //                         res.json('Error')
    //                     }else{
    //                         console.log(stderr);
    //                         database_insert_medias(id,id +'/' + title + '(' + bitrate + 'Kbps)' + '.mp3', bitrate);
    //                         res.json({
    //                             mp3: 'http://localhost:3001/' + id + '/' + title + '(' + bitrate + 'Kbps)'  + '.mp3'
    //                         });
    //                     }
    //                 });
    //             }else{
    //                 //var sqlInfos = 'SELECT url,thumbnail FROM infos WHERE id = ?';
    //                 //query(sqlInfos,[id], function (err, result) {
    //                     //var rows = JSON.parse(JSON.stringify(result[0]));
    //                     //console.log(rows);
    //                 ytdl.getInfo(videourl + id, function getInfo(err, info) {
    //                     'use strict';
    //                     if (err) {
    //                         console.log(err);
    //                         res.json(error)
    //                     }else{
    //                         var len = info.formats.length;
    //                         var formats = [];
    //                         var i = 0;
    //                         var audioUrl = '';
    //                         var imgUrl;
    //                         while (--len){
    //                             if(info.formats[i].width || info.formats[i].height){
    //                                 break
    //                             }else{
    //                                 formats.push({itag: info.formats[i].format_id, url: info.formats[i].url})
    //                             }
    //                             i++;
    //                         }
    //                         var results = formats.filter(function( obj ) {
    //                             var v = Math.max.apply(null, formats.map(mapI));
    //                             return parseInt(obj.itag) === parseInt(v);
    //                         });
    //                         if(results.length > 0){
    //                             audioUrl = results[0].url
    //                         }
    //
    //                         console.log(info.thumbnail);
    //                         imgUrl = info.thumbnail;
    //                         var img = request.get({url: imgUrl}, function(error, response, body) {
    //                             if(error){
    //                                 console.log(error);
    //                                 res.json(error)
    //                             }else{
    //                                 //console.log(body);
    //                             }
    //                         }).pipe(fs.createWriteStream(dir + id + '/img'));
    //
    //                         img.on('finish', function () {
    //                             // execFile('ffmpeg -n -i '+ dir + id + '/file' + ' -i '+ dir + id + '/img' + ' -f mp3 -ab ' + bitrate + 'k ' + ' -map 0:0 -map 1:0 -id3v2_version 4 ' + dir + id + '/"' + title + '(' + bitrate + 'Kbps)' + '".mp3', {}, function error(err, stdout, stderr) {
    //                             //     console.log('error hayete ' + err);
    //                             //     console.log('std ' + stderr);
    //                             //     // execFile('ffmpeg -i '+ dir + id + '/"' + title + '(' + bitrate + 'Kbps)' + '".mp3' + ' -i '+ dir + id + '/img' + ' -map 0:0 -map 1:0 -codec copy -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)" ' + dir + id + '/"' + title + '(' + bitrate + 'Kbps)' + '".mp3', {}, function error(err, stdout, stderr) {
    //                             //     //      console.log('error zabre ' + err);
    //                             //     //     console.log('ok' +stderr);
    //                             //     //     //console.log(stdout);
    //                             //     //     //database_insert_medias(id,id +'/' + title + '(' + bitrate + 'Kbps)' + '.mp3', bitrate);
    //                             //     //     res.json({
    //                             //     //         mp3: 'http://localhost:3001/' + id + '/' + title + '(' + bitrate + 'Kbps)'  + '.mp3'
    //                             //     //     });
    //                             //     // });
    //                             // });
    //                             var stream = request.get({url: audioUrl}, function(error, response, body) {
    //                                 if(error){
    //                                     console.log(error);
    //                                     res.json(error)
    //                                 }else{
    //                                     //console.log(body);
    //                                     //res.json(body)
    //                                 }
    //                             }).pipe(fs.createWriteStream(dir + id + '/' + id));
    //
    //                             stream.on('finish', function () {
    //                                 execFile('ffmpeg -n -i '+ dir + id + '/' + id + ' -i '+ dir + id + '/img' + ' -map 0:0 -map 1:0 -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)"' + ' -f mp3 -ab ' + bitrate + 'k ' + dir + id + '/"' + title + '(' + bitrate + 'Kbps)' + '".mp3', {}, function error(err, stdout, stderr) {
    //                                     if(err){
    //                                         console.log(err)
    //                                     }else{
    //                                         console.log(stderr);
    //                                         database_insert_medias(id,id +'/' + title + '(' + bitrate + 'Kbps)' + '.mp3', bitrate);
    //                                         res.json({
    //                                             mp3: 'http://localhost:3001/' + id + '/' + title + '(' + bitrate + 'Kbps)'  + '.mp3'
    //                                         });
    //                                     }
    //                                 });
    //                             })
    //                         });
    //                     }
    //                 });
    //                 //});
    //             }
    ytdl.exec(videourl+id, ['-x','--no-part', '--write-all-thumbnails', '--no-post-overwrites', '--audio-format', 'mp3',
        '--audio-quality', '320' + 'K', '--embed-thumbnail', '-o', dir + id +'/%(title)s' + '(' + '320' + 'Kbps)' + '.%(ext)s', '--prefer-ffmpeg'], {}, function exec(err, output) {
        if(err) {
            console.log(err);
            res.json(err)
        }else{
            console.log(output);
            //database_insert_medias(id,id +'/' + title + '(' + bitrate + 'Kbps)' + '.mp3', bitrate);
            res.json({
                res: 'done'
            });
            // mp3: 'http://localhost:3001/' + id + '/' + title + '(' + bitrate + 'Kbps)' + '.mp3'
        }
    })
    //         }
    //     }
    // });
});

module.exports = router;