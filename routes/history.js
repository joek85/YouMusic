var express = require('express');
var router = express.Router();
const DATE_FORMATER = require( 'dateformat' );

router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var user = req.query['userid'];
    var d = req.query['d'];
    var harray = [];
    var output = [];
    // console.log(d);
     var sql2 = 'SELECT DISTINCT media_id,channel_id,channel_name,title,duration_hms,thumbnail,play_counts,published_at FROM `history` WHERE date = ? AND user_id = ? GROUP BY nb DESC';
    // var sql = 'SELECT date, GROUP_CONCAT(DISTINCT media_id SEPARATOR \',\') AS medias \n' +
    //     'FROM history\n' +
    //     'WHERE user_id = ?\n' +
    //     'GROUP BY date DESC\n' +
    //     'LIMIT 500';
    // var sql = 'SELECT DISTINCT\n' +
    //     '  date\n' +
    //     'FROM\n' +
    //     '  (SELECT DISTINCT date from history) as d\n' +
    //     '  GROUP BY date DESC';
    var sql = 'SELECT date ,GROUP_CONCAT(title SEPARATOR \'\\n\') as title, GROUP_CONCAT(media_id SEPARATOR \'\\n\') as ids\n' +
        'FROM history\n' +
        'GROUP BY date DESC';
    var datetme = DATE_FORMATER(d, "yyyy-mm-dd");
    query(sql2,[datetme,user],function (err, result, fields) {
        'use strict';
        if(!err){
            var rows = JSON.parse(JSON.stringify(result));
            //console.log(rows);
            //rows.forEach(function (col) {
                // var datetme = DATE_FORMATER(col.date, "yyyy-mm-dd");
                // query(sql2,datetme,function (err, result, fields) {
                //     'use strict';
                //     if (!err){
                //         output.push({date:datetme}, {data:{hi:'hi'}});
                //         //console.log(output)
                //
                //     }else {
                //         console.log(err)
                //     }
                // });
               // harray.push({date: col.date})
                // harray.push({id:col.media_id, title:col.title, subtitle:col.channel_name, thumbnail:col.thumbnail, duration:col.duration_hms, play_counts:col.play_counts, published_at:col.published_at});
            //});
            // // if(harray && harray.length){
            // //     var sqlmedia = 'SELECT * FROM media WHERE id=?';
            // //     for(var i = 0; i < harray.length; i++) {
            // //         sqlmedia += " OR id=?";
            // //     }
            // //     var slice = sqlmedia.slice(0,sqlmedia.length-8);
            // //     query(slice,harray, function (err, results, fields) {
            // //         if(!err){
            // //             results.forEach(function (t) {
            // //                output.push({
            // //                    id:t.id,
            // //                    title:t.title,
            // //                    thumb: 'http://localhost:3000/' + t.id + '/' + t.id + '.jpg',
            // //                    duration:t.duration
            // //                })
            // //             });
            // //             res.json(output);
            // //             console.log(results)
            // //         }else{
            // //             res.json(err)
            // //         }
            // //     });
            // // }
            // var out = [{id: id, title: videodetails.title, subtitle: videodetails.author, thumbnail: videodetails.thumbnail.thumbnails[0],
            //     duration: videodetails.lengthSeconds, play_counts: videodetails.viewCount, published_at: info.published,
            //     description: videodetails.shortDescription, tags: videodetails.keywords, channel_id: videodetails.channelId,
            //     formats: parseFormats(formats), related: related}];

            //console.log(output);
            res.json(rows)
        }else{
            res.json(err)
        }
    });

});
router.get('/dates', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var user = req.query['userid'];

    var sql = 'SELECT DISTINCT date FROM history WHERE user_id = ? GROUP BY date DESC';
    query(sql,[user],function (err, result, fields) {
        if (!err){
            res.json(result)
        }else{
            res.json(err)
        }
    });
});
function insert(_id, _title, _url) {
    var data = {id: _id, title:_title, url:_url};
    var sql = 'INSERT INTO history SET ?';
    query(sql,[data],function (err, result) {
        console.log(result);
    });
}
function deleteitem(userId, mediaId, callback) {
    var data = [userId, mediaId];
    var sql = 'DELETE FROM history WHERE user_id=? AND media_id=?';
    query(sql,data,function (err, result) {
        callback(err,result)
    });
}
function truncatetable(userId, callback) {
    var data = [userId];
    var sql = 'DELETE FROM history WHERE user_id=?';
    query(sql,data,function (err, result) {
        callback(err,result)
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
// if(!err){
//     var harray = [];
//     var output = [];
//     result.forEach(function (hi) {
//         harray.push(hi.id);
//     });
//     if(harray && harray.length){
//         var sqlmedia = 'SELECT * FROM media WHERE id=?';
//         for(var i = 0; i < harray.length; i++) {
//             sqlmedia += " OR id=?";
//         }
//         var slice = sqlmedia.slice(0,sqlmedia.length-8);
//         query(slice,harray, function (err, results, fields) {
//             if(!err){
//                 results.forEach(function (t) {
//                     output.push({
//                         id:t.id,
//                         title:t.title,
//                         thumb: 'http://localhost:3000/' + t.id + '/' + t.id + '.jpg',
//                         duration:t.duration
//                     })
//                 });
//                 res.json(output);
//                 console.log(results)
//             }else{
//                 res.json(err)
//             }
//         });
//     }
// }else{
//     res.json(err)
// }
module.exports = router;