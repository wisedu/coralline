/**
 * 复制和写入新文件到dest目录
 */

let utils = require('./utils');
let async = require('async');
let path = require('path');


module.exports.run = function(_data, callback) {
    translate(_data, callback);
};

function translate(_data, callback) {
    //读取src下的html文件目录和要复制的文件列表
    let srcFilesData = utils.getSrcFileData(_data.src);
    let htmlPath = srcFilesData.htmlPath;
    let copyFiles = srcFilesData.copyFiles;
    
    async.parallel([
            /**
             * 写html文件
             */
            function(parallelCallback) {
                let writePath = path.join(_data.dest, htmlPath.replace(_data.src, ''));
                let pageHtml = '';
                //有template文件时,读取并将html插入template中
                if(_data.template){
                    utils.readFile(_data.template, function (err, _file) {
                        pageHtml = _file.data.replace(_data.templatePlaceholder, _data.html);
                        utils.writeFile(writePath, pageHtml, parallelCallback);
                    });
                //无template时直接写入文件
                }else{
                    pageHtml = _data.html + `<script src="${_data.pageName}.js"></script>`;
                    utils.writeFile(writePath, pageHtml, parallelCallback);
                }
            },
            //写js文件
            function(parallelCallback) {
                let writePath = path.join(_data.dest, htmlPath.replace(_data.src, '').replace(/\.html$/, '.js'));
                utils.writeFile(writePath, _data.js, parallelCallback);
            },
            /**
             * 复制文件夹下的所有文件
             * @param parallelCallback
             */
            function(parallelCallback) {
                async.forEachOf(copyFiles, function(value, key, eachCallback) {
                    let writePath = path.join(_data.dest, value.replace(_data.src, ''));
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