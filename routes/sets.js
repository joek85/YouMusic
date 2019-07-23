var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var user = req.query['user_id'];
    console.log(user);
    var sql = 'SELECT DISTINCT * FROM sets WHERE user_id = ? ORDER BY time DESC';
    query(sql,[user],function (err, result, fields) {
        'use strict';
        if(!err){
            var harray = [];
            result.forEach(function (col) {
                harray.push({name:col.name , time:col.time});
            });
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
            console.log(harray);
            res.json(harray)
        }else{
            res.json(err)
        }
    });

});
router.post('/add', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var user = req.body.user_id;
    var name = req.body.name;
    var timestr = req.body.timestr;
    console.log(user);
    console.log(name);
    console.log(timestr);
    if(user !== null && user !== undefined){
        if (insert(user,name,timestr)){
            var sql = 'SELECT DISTINCT * FROM sets WHERE user_id = ? ORDER BY time DESC';
            query(sql,[user],function (err, result) {
                'use strict';
                if(!err){
                    var harray = [];
                    result.forEach(function (col) {
                        harray.push({name:col.name , time:col.time});
                    });
                    console.log(harray);
                    res.json(harray)
                }else{
                    res.json(err)
                }
            });
        }else{
            res.json('')
        }

    }else{
        res.json('')
    }
});
function insert(_id, _name, _t) {
    console.log(_t);
    var data = {user_id: _id, name:_name, time:_t};
    var sql = 'INSERT INTO sets SET ?';
    query(sql,[data],function (err, result) {
        if(err){
            console.log(err);
            return false
        }else{
            console.log(result);
            return true
        }
    });
}
function deleteitem(userId, mediaId, callback) {
    var data = [userId, mediaId];
    var sql = 'DELETE FROM history WHERE user_id=? AND media_id=?';
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
module.exports = router;