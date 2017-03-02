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
        `<article @attributes>
            <h2 grid-item="@titleName"></h2>
            <section>@sectionContent</section>
        </article>`;

    let singleNoTitleTemplate =
        `<article @attributes>
            <section>@sectionContent</section>
        </article>`;

    let navLeftTemplate =
        `<article @attributes>
            <h2 grid-item="@titleName"></h2>
            <nav grid-item="@navName" style="@navStyle">
                
            </nav>

            <section style="@sectionStyle">
                @sectionContent
            </section>
        </article>`;

    let navLeftNoTitleTemplate =
        `<article @attributes>
            <nav grid-item="@navName" style="@navStyle">
                
            </nav>

            <section>
                @sectionContent
            </section>
        </article>`;

    let layoutName = $layout.attr('bh-layout-role');

    let attributes = compileAttributes($layout);
    let titleName = '';
    let navName = '';
    let navStyle = '';
    let sectionStyle = '';
    let sectionContent = '';
    let templateHtml = '';
    switch (layoutName){
        case 'single':
            $layout.children().each(function (_index) {
                if(_index === 0){
                    let $title = $(this);
                    titleName = $title.children().attr('grid-item');
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
                    titleName = $title.children().attr('grid-item');
                    $title.remove();
                }else{
                    $(this).children().each(function (_index) {
                        let $item = $(this);
                        if(_index === 0){
                            navName = $item.attr('grid-item');
                            navStyle = $item.attr('style');
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
                    navName = $item.attr('grid-item');
                    navStyle = $item.attr('style');
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
    
    let bhHtml = templateHtml.replace('@attributes',attributes)
        .replace('@titleName',titleName)
        .replace('@navName',navName)
        .replace('@navStyle',navStyle)
        .replace('@sectionStyle',sectionStyle)
        .replace('@sectionContent',sectionContent);
    
    $layout.before(bhHtml);
    $layout.remove();

}

function compileAttributes($item) {
    let attrsStr = '';
    let attrs = $item[0].attribs;
    for(let key in attrs){
        attrsStr += `${key}="${attrs[key]}" `;
    }
    return attrsStr;
}