'use strict';

var utils = require('./utils');
var EOL = require('os').EOL; // OS-dependent End-of-Line;

function decomment(text, options, css) {

    if (typeof text !== 'string') {
        throw new TypeError("Parameter 'text' must be a string.");
    }

    if (options !== undefined && typeof(options) !== 'object') {
        throw new TypeError("Parameter 'options' must be an object.");
    }

    var idx = 0, // current index;
        s = '', // resulting text;
        len = text.length, // text length;
        emptyLine = true, // set while no symbols encountered on the current line;
        emptyLetters = '', // empty letters on a new line;
        isHtml = false, // set when the input is recognized as HTML;
        optTrim = options && options.trim, // 'trim' option;
        optSafe = options && options.safe, // 'safe' option.
        regEx = []; // regular expression details;

    if (!len) {
        return text;
    }

    if (!css) {
        isHtml = utils.isHtml(text);
        if (!isHtml) {
            regEx = utils.parseRegEx(text);
        }
    }

    do {
        if (!isHtml && text[idx] === '/' && idx < len - 1 && (!idx || text[idx - 1] !== '\\')) {
            if (text[idx + 1] === '/') {
                if (utils.indexInRegEx(idx, regEx)) {
                    continue;
                }
                var lb = text.indexOf(EOL, idx + 2);
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

            if (text[idx + 1] === '*') {
                if (utils.indexInRegEx(idx, regEx)) {
                    continue;
                }
                var end = text.indexOf('*/', idx + 2);
                var keep = optSafe && idx < len - 2 && text[idx + 2] === '!';
                if (keep) {
                    if (end >= 0) {
                        s += text.substr(idx, end - idx + 2);
                    } else {
                        s += text.substr(idx, len - idx);
                    }
                }
                if (end < 0) {
                    break;
                }
                idx = end + 1;
                if (emptyLine) {
                    emptyLetters = '';
                    if (!keep) {
                        var lb = text.indexOf(EOL, idx + 1);
                        if (lb > idx) {
                            idx = lb + EOL.length - 1; // last symbol of the line break;
                            trim();
                        }
                    }
                }
                continue;
            }
        }

        if (isHtml && text[idx] === '<' && idx < len - 3 && text.substr(idx + 1, 3) === '!--') {
            var end = text.indexOf('-->', idx + 4);
            if (end < 0) {
                break;
            }
            idx = end + 2;
            if (emptyLine) {
                emptyLetters = '';
                var lb = text.indexOf(EOL, idx + 1);
                if (lb > idx) {
                    idx = lb + EOL.length - 1; // last symbol of the line break;
                    trim();
                }
            }
            continue;
        }

        var symbol = text[idx];
        var isSpace = symbol === ' ' || symbol === '\t';
        if (symbol === '\r' || symbol === '\n') {
            if (text.indexOf(EOL, idx) === idx) {
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
            var closeIdx = text.indexOf(symbol, idx + 1);
            if (utils.indexInRegEx(idx, regEx)) {
                continue;
            }
            if (closeIdx < 0) {
                break;
            }
            s += text.substr(idx + 1, closeIdx - idx);
            idx = closeIdx;
        }

    } while (++idx < len);

    function trim() {
        if (optTrim) {
            var startIdx, endIdx, i;
            do {
                startIdx = idx + 1;
                endIdx = text.indexOf(EOL, startIdx);
                i = startIdx;
                while ((text[i] === ' ' || text[i] === '\t') && ++i < endIdx);
                if (i === endIdx) {
                    idx = endIdx + EOL.length - 1;
                }
            } while (i === endIdx);
        }
    }

    return s;
}

module.exports = decomment;
