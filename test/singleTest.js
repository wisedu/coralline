var convert = require('../index');
var path = require('path');
var async = require('async');
var utils = require('./utils');

async.parallel([
        function(parallelCallback) {
            utils.readFile(path.join(path.resolve(), 'test/pages/single/single.html'), parallelCallback);
        },
        function(parallelCallback) {
            utils.readFile(path.join(path.resolve(), 'test/pages/single/single.scss'), parallelCallback);
        }
    ],
    function(err, _results) {
        var data = convert.convert(_results[0].data, _results[1].data);
        console.log(data)
    });