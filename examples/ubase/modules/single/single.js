define(function(require, exports, module){
            var utils = require('utils');
            var viewConfig = {
                initialize: function(){
                    var view = utils.loadCompiledPage('single');
                    this.$rootElement.html(view.render({}), true);
        
                    $("#search").emapAdvancedQuery(getOption("#search"));

                },
                eventMap: function(){
                    return{
                        "#search": this.searchClick
                    }
                }
            };
            
            return viewConfig;
        });