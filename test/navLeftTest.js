var convert = require('../index');
var path = require('path');


let _srcFolderPath = path.join(__dirname, './pages/layoutNavLeft');
// let _templatePath = path.join(__dirname, './template/layout.html');
// let _templateContentPlaceholderKey = '<%- body %>';
let _translateType = 'ubase';

let data = {
    src: _srcFolderPath,
    // template: _templatePath,
    // templatePlaceholder: _templateContentPlaceholderKey,
    translateType: _translateType
};

convert.convert(data, function (err, _result) {
    console.log(_result)
});