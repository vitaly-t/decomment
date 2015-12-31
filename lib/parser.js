'use strict';

var uglify = require('uglify-js');
var estraverse = require('estraverse');
var esprima = require('esprima');

///////////////////////////////////////////////////////////
// For each AST parser here:
//
// Parses the code and returns a dictionary of relative
// coordinates, as `line index`: [{start, end},...], where
// {start, end} are the inclusive indexes of regEx content.
///////////////////////////////////////////////////////////

function parseThroughUglifyJS(code) {
    var parsedCode = uglify.parse(code);
    var data = {};
    parsedCode.walk(new uglify.TreeWalker(function (obj) {
        if (obj instanceof uglify.AST_RegExp) {
            var reg = obj.end;
            var name = reg.line - 1;
            if (!data[name]) {
                data[name] = [];
            }
            data[name].push({
                start: reg.col + 1,
                end: reg.endcol - 2
            });
        }
    }));
    return data;
}

function parseThroughEsprima(code) {
    var parsedCode = esprima.parse(code, {
        range: true,
        loc: true
    });
    var data = {};
    estraverse.traverse(parsedCode, {
        enter: function (node) {
            if (node.type === 'Literal' && node.regex) {
                var name = node.loc.start.line - 1;
                if (!data[name]) {
                    data[name] = [];
                }
                data[name].push({
                    start: node.loc.start.column + 1,
                    end: node.loc.end.column - 1
                });
            }
        }
    });
    return data;
}

module.exports = function (code) {
    //return parseThroughUglifyJS(code);
    return parseThroughEsprima(code);
};
