var fs = require('fs');
var dir = process.cwd() + '/media/';
var express = require('express');
var router = express.Router();

exports.get_mp3 = function(req, res) {
    res.json('NOT IMPLEMENTED: Book update POST');
};




var checkMP3 = function (id) {
    return fs.existsSync(dir + id + '/' + id + '.mp3');
};

module.exports = router;