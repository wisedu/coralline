let utils = require('./utils');
let async = require('async');
let path = require('path');


module.exports.run = function(_contentHtml, _templatePath, _templateContentPlaceholderKey, _srcFolderPath, _destFolderPath, callback) {
    translate(_contentHtml, _templatePath, _templateContentPlaceholderKey, _srcFolderPath, _destFolderPath, callback);
};

function translate(_contentHtml, _templatePath, _templateContentPlaceholderKey, _srcFolderPath, _destFolderPath, callback) {
    let htmlPath = '';
    let copyFiles = [];
    
    let srcFiles = utils.scanFolder(_srcFolderPath).files;
    for(let _file of srcFiles){
        if(/\.html$/.test(_file)){
            htmlPath = _file;
            continue;
        }else if(/\.DS_Store/.test(_file)){
            continue;
        }

        copyFiles.push(_file);
    }
    
    async.parallel([
            /**
             * 读取外框html模板文件,并将编译后的html加入
             */
            function(parallelCallback) {
                utils.readFile(_templatePath, function (err, _file) {
                    let pageHtml = _file.data.replace(_templateContentPlaceholderKey, _contentHtml);
                    let writePath = path.join(_destFolderPath, htmlPath.replace(_srcFolderPath, ''));
                    utils.writeFile(writePath, pageHtml, parallelCallback);
                });
            },
            /**
             * 复制文件夹下的所有文件
             * @param parallelCallback
             */
            function(parallelCallback) {
                async.forEachOf(copyFiles, function(value, key, eachCallback) {
                    let writePath = path.join(_destFolderPath, value.replace(_srcFolderPath, ''));
                    utils.copyFile(value, writePath, eachCallback);
                }, function(err) {
                    parallelCallback(null, null);
                });
            }
        ],
        function(err, results) {
            callback(null, null);
        });
}