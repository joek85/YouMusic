var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var email = req.query['em'];
    var sql = 'SELECT id FROM library WHERE user_email = ?';
    query(sql,[email], function (err, results, fields) {
        'use strict';
        if(!err){
            console.log(results);
            res.json(results)
        }else{
            console.log(err);
            res.json(err)
        }
    })
});
router.get('/add', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var email = req.query['em'];
    var id = req.query['id'];

    insert(email,id,function (err, results) {
        if(!err){
            res.json('success')
        }else{
            res.json(err)
        }
    })
});
router.get('/delete', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var email = req.query['em'];
    var id = req.query['id'];

    deleteitem(email,id,function (err, results) {
        if(!err){
            res.json('success')
        }else{
            res.json(err)
        }
    })
});
function insert(email, _id, callback) {
    var data = {user_email: email, id: _id};
    var sql = 'INSERT INTO library SET ?';
    query(sql,data,function (err, result) {
        callback(err,result)
    });
}
function deleteitem(email, _id, callback) {
    var data = [email, _id];
    var sql = 'DELETE FROM library WHERE user_email=? AND id=?';
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