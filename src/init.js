var gridToBh = require('./gridSystemHtmlToBhLayout');
var dest = require('./dest');
var trailbreaker = require('trailbreaker');
var async = require('async');

module.exports.convert = function(_data, callback) {
    convert(_data, callback);
};

/**
 * 
 * @param _data
 * @param _data.src
 * @param _data.dest
 * @param _data.template
 * @param _data.templatePlaceholder
 * @param topCallback
 */
function convert(_data, topCallback) {
    async.waterfall([
        function(callback) {
            trailbreaker.run(_data.src, callback);
        },
        function(_result, callback) {
            let newLayout = gridToBh.change(_result);
            dest.run(newLayout, _data.template, _data.templatePlaceholder, _data.src, _data.dest, callback);
        },
        function(_data, callback) {
            topCallback(null, {
                type: 'success'
            });
        }
    ]);
}
