var gridToBh = require('./gridSystemHtmlToBhLayout');
var dest = require('./dest');
var utils = require('./utils');
var generateJs = require('./generateJs');
var trailbreaker = require('trailbreaker');
var async = require('async');

/**
 * 转换将模板转换成bh布局
 * @param _data
 * @param _data.src 模板所在目录
 * @param _data.template html要插入的模板外框文件路径,若值为空则直接先入转换后的html
 * @param _data.templatePlaceholder 与template字段连用,html要插入的标志位
 * @param _data.translateType 模板要转换的类型,ubase,vue
 * @param callback 回调
 */
module.exports.convert = function(_data, callback) {
    convert(_data, callback);
};

/**
 * 转换将模板转换成bh布局
 * @param _data
 * @param _data.src 模板所在目录
 * @param _data.template html要插入的模板外框文件路径,若值为空则直接先入转换后的html
 * @param _data.templatePlaceholder 与template字段连用,html要插入的标志位
 * @param _data.translateType 模板要转换的类型,ubase,vue
 * @param topCallback 回调
 */
function convert(_data, topCallback) {
    //在_data对象中添加pageName(html页面名称)字段
    utils.addPageNameToData(_data);
    /**
     * 在_data对象中添加dest(编译后输出目录)字段
     */
    utils.addDestPathToData(_data);

    async.waterfall([
        //读取html转换成栅格布局
        function(callback) {
            trailbreaker.run(_data.src, callback);
        },
        function(_result, callback) {
            //将栅格转换成bh布局
            let bhLayout = gridToBh.change(_result);
            //读取html内的组件,生成js文件内容
            let jsContent = generateJs.translate(bhLayout, _data.pageName, _data.translateType);
            //将js和html添加到_data对象
            _data.js = jsContent;
            _data.html = bhLayout;

            //写文件到dest目录下
            dest.run(_data, callback);
        },
        function(_data, callback) {
            topCallback(null, {
                type: 'success'
            });
        }
    ]);
}


