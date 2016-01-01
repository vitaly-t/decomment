'use strict';

var utils = require('./utils');
var EOL = require('os').EOL; // OS-dependent End-of-Line;

function parser(code, options, config) {

    if (typeof code !== 'string') {
        throw new TypeError("Input code/text/html must be string.");
    }

    if (options !== undefined && typeof(options) !== 'object') {
        throw new TypeError("Parameter 'options' must be an object.");
    }

    var idx = 0, // current index;
        s = '', // resulting code;
        len = code.length, // code length;
        emptyLine = true, // set while no symbols encountered on the current line;
        emptyLetters = '', // empty letters on a new line;
        optTrim = options && options.trim, // 'trim' option;
        optSafe = options && options.safe, // 'safe' option;
        checkRegEx = false, // indicates whether regEx is to be used;
        isHtml, // set when the input is recognized as HTML;
        regEx; // regular expression details;

    if (!len) {
        return code;
    }

    if (config.parse) {
        isHtml = utils.isHtml(code);
        if (!isHtml) {
            regEx = utils.parseRegEx(code);
            checkRegEx = regEx.length > 0;
        }
    } else {
        isHtml = config.html;
    }

    do {
        if (!isHtml && code[idx] === '/' && idx < len - 1 && (!idx || code[idx - 1] !== '\\')) {
            if (code[idx + 1] === '/') {
                if (checkRegEx && utils.indexInRegEx(idx, regEx)) {
                    continue;
                }
                var lb = code.indexOf(EOL, idx + 2);
                if (lb < 0) {
                    break;
                }
                if (emptyLine) {
                    emptyLetters = '';
                    idx = lb + EOL.length - 1; // last symbol of the line break;
                    trim();
                } else {
                    idx = lb - 1; // just before the line break;
                }
                continue;
            }

            if (code[idx + 1] === '*') {
                if (checkRegEx && utils.indexInRegEx(idx, regEx)) {
                    continue;
                }
                var end = code.indexOf('*/', idx + 2);
                var keep = optSafe && idx < len - 2 && code[idx + 2] === '!';
                if (keep) {
                    if (end >= 0) {
                        s += code.substr(idx, end - idx + 2);
                    } else {
                        s += code.substr(idx, len - idx);
                    }
                }
                if (end < 0) {
                    break;
                }
                idx = end + 1;
                if (emptyLine) {
                    emptyLetters = '';
                    if (!keep) {
                        var lb = code.indexOf(EOL, idx + 1);
                        if (lb > idx) {
                            idx = lb + EOL.length - 1; // last symbol of the line break;
                            trim();
                        }
                    }
                }
                continue;
            }
        }

        if (isHtml && code[idx] === '<' && idx < len - 3 && code.substr(idx + 1, 3) === '!--') {
            var end = code.indexOf('-->', idx + 4);
            if (end < 0) {
                break;
            }
            idx = end + 2;
            if (emptyLine) {
                emptyLetters = '';
                var lb = code.indexOf(EOL, idx + 1);
                if (lb > idx) {
                    idx = lb + EOL.length - 1; // last symbol of the line break;
                    trim();
                }
            }
            continue;
        }

        var symbol = code[idx];
        var isSpace = symbol === ' ' || symbol === '\t';
        if (symbol === '\r' || symbol === '\n') {
            if (code.indexOf(EOL, idx) === idx) {
                emptyLine = true;
            }
        } else {
            if (!isSpace) {
                emptyLine = false;
                s += emptyLetters;
                emptyLetters = '';
            }
        }
        if (emptyLine && isSpace) {
            emptyLetters += symbol;
        } else {
            s += symbol;
        }

        if (!isHtml && (symbol === '\'' || symbol === '"' || symbol === '`')) {
            var closeIdx = code.indexOf(symbol, idx + 1);
            if (checkRegEx && utils.indexInRegEx(idx, regEx)) {
                continue;
            }
            if (closeIdx < 0) {
                break;
            }
            s += code.substr(idx + 1, closeIdx - idx);
            idx = closeIdx;
        }

    } while (++idx < len);

    function trim() {
        if (optTrim) {
            var startIdx, endIdx, i;
            do {
                startIdx = idx + 1;
                endIdx = code.indexOf(EOL, startIdx);
                i = startIdx;
                while ((code[i] === ' ' || code[i] === '\t') && ++i < endIdx);
                if (i === endIdx) {
                    idx = endIdx + EOL.length - 1;
                }
            } while (i === endIdx);
        }
    }

    return s;
}

module.exports = parser;
