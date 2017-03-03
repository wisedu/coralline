var fs = require('fs');
var path = require('path');
var async = require('async');

/**
 * 同步创建文件夹
 * @param dirpath 要创建的路径
 */
module.exports.createFolder = function(dirpath) {
    createFolder(dirpath);
};

/**
 * 同步遍历文件夹，返回所有文件夹和文件路径
 * @param _path
 * @returns {{files: Array, folders: Array}}
 */
module.exports.scanFolder = function(_path) {
    return scanFolder(_path);
};

/**
 * 复制文件
 * @param readPath 读取路径
 * @param writePath 写入路径
 * @param callback
 */
module.exports.copyFile = function(readPath, writePath, callback) {
    copyFile(readPath, writePath, callback);
};

/**
 * 获取目标路径下的html文件和要复制的文件
 * @param _src
 * @returns {{htmlPath: string, copyFiles: Array}}
 */
module.exports.getSrcFileData = function(_src) {
    return getSrcFileData(_src);
};

/**
 * 根据转换类型,添加dest字段到data对象中
 * @param _data
 */
module.exports.addDestPathToData = function(_data) {
    addDestPathToData(_data);
};

/**
 * 获取html文件名,并添加到pageName字段
 * @param _data
 */
module.exports.addPageNameToData = function(_data) {
    addPageNameToData(_data);
};

/**
 * 生成guid
 * @returns {string}
 */
module.exports.newGuid = function() {
    return (S4() + S4() + "_" + S4() + "_" + S4() + "_" + S4() + "_" + S4() + S4() + S4());
};

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

/**
 * 写文件
 * @param writePath 要写入的文件的路径
 * @param fileData 要写入的内容
 * @param callback
 */
module.exports.writeFile = function(writePath, fileData, callback) {
    writeFile(writePath, fileData, callback);
};

/**
 * 异步读文件
 * @param readPath 读取的文件地址
 * @param callback
 */
module.exports.readFile = function(readPath, callback) {
    readFile(readPath, callback);
};

/**
 * 去掉字符串两端的空格
 * @param str
 */
module.exports.trim = function(str) {
    return trim(str);
};

/**
 * 判断数据是否是json对象
 * @param obj
 * @returns {boolean}
 */
module.exports.isJson = function(obj) {
    return typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
};

/**
 * 判断数据是否是数组
 * @param obj
 * @returns {boolean}
 */
module.exports.isArray = function(obj) {
    return toString.apply(obj) === '[object Array]';
};

/**
 * 判断数据是否是字符串
 * @param obj
 * @returns {boolean}
 */
module.exports.isString = function(obj) {
    return Object.prototype.toString.apply(obj) === '[object String]';
};

/**
 * 判断数据是否是空对象
 * @param obj
 * @returns {boolean}
 */
module.exports.isEmptyObject = function(obj) {
    var key;
    for (key in obj) {
        return false;
    }
    return true;
};

/**
 * 去掉字符串两端的空格
 * @param str
 * @returns {string}
 */
function trim(str) {
    var newStr = '';
    if (str) {
        var reg = /^\s*|\s*$/g;
        newStr = str.replace(reg, '');
    }
    return newStr;
}

function createFolder(dirpath) {
    if (!fs.existsSync(dirpath)) {
        dirpath = checkAndGetFolderPath(dirpath);
        dirpath = dirpath.replace(path.resolve(), '');
        var pathtmp;
        dirpath.split(path.sep).forEach(function(dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            }else {
                pathtmp = dirname;
            }
            if(pathtmp){
                if (!fs.existsSync(pathtmp)) {
                    if (!fs.mkdirSync(pathtmp)) {
                        return false;
                    }
                }
            }
        });
    }

    return true;
}

/**
 * 验证路径是否是文件夹路径,若不是则提取文件夹路径,并返回
 * @param _path
 * @returns {*}
 */
function checkAndGetFolderPath(_path) {
    let file_match = _path.match(/\/(\w*(-\w*)*)\.\w*$/);
    if (file_match) {
        _path = _path.replace(file_match[0], '');
    }

    return _path;
}

function scanFolder(_path) {
    var fileList = [],
        folderList = [],
        walk = function(path, fileList, folderList) {
            files = fs.readdirSync(path);
            files.forEach(function(item) {
                var tmpPath = /\/$/.test(path) ? path + item : path + '/' + item,
                    stats = fs.statSync(tmpPath);

                if (stats.isDirectory()) {
                    walk(tmpPath, fileList, folderList);
                    folderList.push(tmpPath);
                } else {
                    fileList.push(tmpPath);
                }
            });
        };

    walk(_path, fileList, folderList);

    return {
        'files': fileList,
        'folders': folderList
    };
}

/**
 * 单文件复制
 * @param readPath
 * @param writePath
 * @param callback
 */
function copyFile(readPath, writePath, callback) {
    fs.exists(readPath,function (_exists) {
        if(_exists){
            try{
                //验证并创建文件夹
                createFolder(writePath);
                var readFile = fs.createReadStream(readPath);
                var writeFile = fs.createWriteStream(writePath);

                writeFile.on("close", function() {
                    callback(null, readPath);
                });

                readFile.pipe(writeFile);
            }catch (err){
                console.error(err);
                callback(null, '');
            }
        }else{
            callback(null, '');
        }
    });
}

function writeFile(writePath, fileData, callback) {
    //验证并创建文件夹
    createFolder(writePath);
    fs.writeFile(writePath, fileData, function(err) {
        if (err) {
            console.log(err);
            return callback(null, { 'type': 'error', 'message': err, 'path': writePath });
        }

        return callback(null, { 'type': 'success', 'path': writePath });
    });
}

function readFile(readPath, callback) {
    fs.readFile(readPath, 'utf-8', function(err, data) {
        if (err) {
            console.log(err);
            return callback(null, { 'type': 'error', 'message': err, 'path': readPath });
        } else {
            if (/\.json$/.test(readPath)) {
                try {
                    data = JSON.parse(data);
                    callback(null, { 'type': 'success', 'data': data, 'path': readPath });
                } catch (err) {
                    console.log(err);
                    callback(null, { 'type': 'error', 'message': err, 'path': readPath });
                }
            } else {
                callback(null, { 'type': 'success', 'data': data, 'path': readPath });
            }
        }
    });
}

/**
 * 根据转换类型,添加dest字段到data对象中
 * @param _data
 */
function addDestPathToData(_data) {
    let dest = '';
    switch (_data.translateType){
        case 'ubase':
            dest = 'examples/ubase/modules/'+_data.pageName;
            break;
    }

    _data.dest = path.join(path.resolve(), dest);
}

/**
 * 获取html文件名,并添加到pageName字段
 * @param _data
 */
function addPageNameToData(_data) {
    let htmlPath = getSrcFileData(_data.src).htmlPath;
    let pageName = htmlPath.substring(htmlPath.lastIndexOf('/')+1, htmlPath.lastIndexOf('.'));
    _data.pageName = pageName;
}

/**
 * 获取目标路径下的html文件和要复制的文件
 * @param _src
 * @returns {{htmlPath: string, copyFiles: Array}}
 */
function getSrcFileData(_src) {
    let htmlPath = '';
    let copyFiles = [];

    let srcFiles = scanFolder(_src).files;
    for(let _file of srcFiles){
        if(/\.html$/.test(_file)){
            htmlPath = _file;
            continue;
        }else if(/\.DS_Store/.test(_file)){
            continue;
        }

        copyFiles.push(_file);
    }

    return {
        htmlPath: htmlPath,
        copyFiles: copyFiles
    }
}