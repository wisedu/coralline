/**
 * 生成js文件内容
 */

let ubase = require('./translateUbase');

module.exports.translate = function(_html, _pageName, _translateType) {
    return translate(_html, _pageName, _translateType);
};


function translate(_html, _pageName, _translateType) {
    let jsContent = '';
    switch (_translateType){
        case 'ubase':
            jsContent = ubase.translate(_html, _pageName);
            break;
    }
    
    return jsContent;
}