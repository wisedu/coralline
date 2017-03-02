var convert = require('../index');
var path = require('path');


let _srcFolderPath = path.join(__dirname, './pages/layoutNavLeft');
let _destFolderPath = path.join(__dirname, './example/');
let _templatePath = path.join(__dirname, './template/layout.html');
let _templateContentPlaceholderKey = '<%- body %>';
// let _srcFolderPath = './pages/layoutNavLeft';
// let _destFolderPath = './example/';
// let _templatePath = path.join(__dirname, './template/layout.html');

let data = {
    src: _srcFolderPath,
    dest: _destFolderPath,
    template: _templatePath,
    templatePlaceholder: _templateContentPlaceholderKey
};

convert.convert(data, function (err, _result) {
    console.log(_result)
});