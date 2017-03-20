var gridToBh = require('./gridSystemHtmlToBhLayout');
var trailbreaker = require('trailbreaker');

/**
 * 转换将模板转换成bh布局
 * @param _data
 * @param _data.src 模板所在目录
 * @param _data.template html要插入的模板外框文件路径,若值为空则直接先入转换后的html
 * @param _data.templatePlaceholder 与template字段连用,html要插入的标志位
 * @param _data.translateType 模板要转换的类型,ubase,vue
 * @param callback 回调
 */
module.exports.convert = function(_html, _style) {
    return convert(_html, _style);
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
function convert(_html, _style) {
    let gridSystem = trailbreaker.run(_html, _style);
    let bhLayout = gridToBh.change(gridSystem);

    return bhLayout;
}


