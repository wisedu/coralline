/**
 * 将栅格转换成bh布局
 */
let utils = require('./utils');
let async = require('async');
let cheerio = require('cheerio');
let path = require('path');

module.exports.change = function(_gridSystemHtml) {
    return gridSystemToBh(_gridSystemHtml);
};


function gridSystemToBh(_gridSystemHtml) {
    let guid = utils.newGuid();
    let $ = cheerio.load(`<div id="${guid}">${_gridSystemHtml}</div>`);
    let $content = $(`#${guid}`);
    //读取是否存在bh-layout-role属性,有则进行转换,无则返回原html
    let $layout = $content.find('[bh-layout-role]');

    if($layout.length === 0){
        return _gridSystemHtml;
    }

    $layout.each(function () {
        refactorGridSystemToBhLayout($(this), $);
    });

    return $content.html();
}


/**
 * 将栅格系统转换成bh布局
 * @param _gridSystem 栅格布局的html
 * @param _type 布局类型, single, single-no-title, navLeft, navLeft-no-title
 */
function refactorGridSystemToBhLayout($layout, $) {
    let singleTemplate =
        `<article @articleAttrs>
            <h2 @titleAttrs>@titleContent</h2>
            <section>@sectionContent</section>
        </article>`;

    let singleNoTitleTemplate =
        `<article @articleAttrs>
            <section>@sectionContent</section>
        </article>`;

    let navLeftTemplate =
        `<article @articleAttrs>
            <h2 @titleAttrs>@titleContent</h2>
            <nav @navAttrs>
                @navContent
            </nav>

            <section style="@sectionStyle">
                @sectionContent
            </section>
        </article>`;

    let navLeftNoTitleTemplate =
        `<article @articleAttrs>
            <nav @navAttrs>
                @navContent
            </nav>

            <section style="@sectionStyle">
                @sectionContent
            </section>
        </article>`;

    let layoutName = $layout.attr('bh-layout-role');

    //一个bh-layout-role节点的属性
    let articleAttrs = compileAttributes($layout);
    //标题属性
    let titleAttrs = '';
    //标题内容
    let titleContent = '';
    //nav属性
    let navAttrs = '';
    //nav的内容
    let navContent = '';
    //section的样式
    let sectionStyle = '';
    //section的内容
    let sectionContent = '';
    //对应的bh模板html
    let templateHtml = '';
    switch (layoutName){
        case 'single':
            $layout.children().each(function (_index) {
                if(_index === 0){
                    let $title = $(this);
                    titleAttrs = compileAttributes($title);
                    titleContent = $title.html();
                    $title.remove();
                    return false;
                }
            });
            sectionContent = $layout.html();
            templateHtml = singleTemplate;
            break;
        case 'single-no-title':
            sectionContent = $layout.html();
            templateHtml = singleNoTitleTemplate;
            break;
        case 'navLeft':
            $layout.children().each(function (_index) {
                if(_index === 0){
                    let $title = $(this);
                    titleAttrs = compileAttributes($title);
                    titleContent = $title.html();
                    $title.remove();
                }else{
                    $(this).children().each(function (_index) {
                        let $item = $(this);
                        if(_index === 0){
                            navAttrs = compileAttributes($item, ['class']);
                            navContent = $item.html();
                        }else{
                            sectionStyle = $item.attr('style');
                            sectionContent = $item.html();
                        }
                    });
                }
            });

            templateHtml = navLeftTemplate;
            break;
        case 'navLeft-no-title':
            $layout.children().children().each(function (_index) {
                let $item = $(this);
                if(_index === 0){
                    navAttrs = compileAttributes($item, ['class']);
                    navContent = $item.html();
                }else{
                    sectionStyle = $item.attr('style');
                    sectionContent = $item.html();
                }
            });

            templateHtml = navLeftNoTitleTemplate;
            break;
        default:
            templateHtml = '';
            break;
    }
    
    if(!templateHtml){
        return;
    }
    
    let bhHtml = templateHtml.replace('@articleAttrs',articleAttrs)
        .replace('@titleAttrs',titleAttrs)
        .replace('@titleContent',titleContent)
        .replace('@navAttrs',navAttrs)
        .replace('@navContent',navContent)
        .replace('@sectionStyle',sectionStyle)
        .replace('@sectionContent',sectionContent);

    //插入bh的html
    $layout.before(bhHtml);
    //删除原来的栅格html
    $layout.remove();

}

/**
 * 复制属性到节点对象上
 * @param $item
 * @param ignoreArray {Array} 要过滤的属性
 * @returns {string}
 */
function compileAttributes($item, ignoreArray) {
    let attrsStr = '';
    let attrs = $item[0].attribs;
    for(let key in attrs){
        if(ignoreArray && ignoreArray.indexOf(key) > -1){
            continue;
        }
        attrsStr += `${key}="${attrs[key]}" `;
    }
    return attrsStr;
}