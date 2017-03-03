/**
 * 生成ubase的js内容
 */

let cheerio = require('cheerio');
let componentsConfig = require('./componentsConfig');

module.exports.translate = function(_html, _pageName) {
    return translate(_html, _pageName);
};


function translate(_html, _pageName) {
    let components = componentsConfig.config();
    let $ = cheerio.load(_html);
    let initialize = '';
    let eventMap = '';
    $('[type]').each(function () {
        let $item = $(this);
        let type = $item.attr('type');
        let component = components[type];
        if(component){
            let initFun = component['initFun'];
            let id = $item.attr('id');
            let dataOption = $item.attr('data-options');
            let clickFun = $item.attr('click');



            initialize += `$("#${id}").${initFun}(getOption("#${id}"));\n`;

            eventMap += `"#${id}": this.${clickFun},\n`;
        }
    });

    eventMap = eventMap.replace(/,\n$/, '');
    
    let jsTemplate = 
        `define(function(require, exports, module){
            var utils = require('utils');
            var viewConfig = {
                initialize: function(){
                    var view = utils.loadCompiledPage('${_pageName}');
                    this.$rootElement.html(view.render({}), true);
        
                    ${initialize}
                },
                eventMap: function(){
                    return{
                        ${eventMap}
                    }
                }
            };
            
            return viewConfig;
        });`;
    
    return jsTemplate;
}