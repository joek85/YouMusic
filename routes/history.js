var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var user = req.query['userid'];
    console.log(user);
    //var sql = 'SELECT DISTINCT * FROM history WHERE user_id = ? ORDER BY date DESC';
    var sql = 'SELECT date, GROUP_CONCAT(DISTINCT media_id SEPARATOR \',\') AS medias \n' +
        'FROM history\n' +
        'WHERE user_id = ?\n' +
        'GROUP BY date DESC\n' +
        'LIMIT 500';
    query(sql,[user],function (err, result, fields) {
        'use strict';
        if(!err){
            var rows = JSON.parse(JSON.stringify(result));
            // var harray = [];
            // var output = [];
            // result.forEach(function (col) {
            //     harray.push(col.media_id);
            // });
            // if(harray && harray.length){
            //     var sqlmedia = 'SELECT * FROM media WHERE id=?';
            //     for(var i = 0; i < harray.length; i++) {
            //         sqlmedia += " OR id=?";
            //     }
            //     var slice = sqlmedia.slice(0,sqlmedia.length-8);
            //     query(slice,harray, function (err, results, fields) {
            //         if(!err){
            //             results.forEach(function (t) {
            //                output.push({
            //                    id:t.id,
            //                    title:t.title,
            //                    thumb: 'http://localhost:3000/' + t.id + '/' + t.id + '.jpg',
            //                    duration:t.duration
            //                })
            //             });
            //             res.json(output);
            //             console.log(results)
            //         }else{
            //             res.json(err)
            //         }
            //     });
            // }
            console.log(rows);
            res.json('hi')
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