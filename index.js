'use strict';

var EOL = require('os').EOL; // OS-dependent End-of-Line;

function decomment(text, options) {

    if (typeof text !== 'string') {
        throw new TypeError("Parameter 'text' must be a string.");
    }

    if (options !== undefined && typeof(options) !== 'object') {
        throw new TypeError("Parameter 'options' must be an object.");
    }

    var idx = 0, // current index;
        s = '', // resulting text;
        len = text.length, // text length;
        regExIdx = -1, // first possible regEx index in the current line;
        emptyLine = true, // set while no symbols encountered on the current line;
        emptyLetters = '', // empty letters on a new line;
        isHtml = false, // set when the input is recognized as HTML;
        optTrim = options && options.trim,
        optSafe = options && options.safe;

    if (!len) {
        return text;
    }

    var tag;
    do {
        tag = text[idx];
        if (tag !== ' ' && tag !== '\t' && tag !== '\r' && tag !== '\n') {
            isHtml = tag === '<';
            break;
        }
    } while (++idx < len);
    idx = 0;

    do {
        if (!isHtml && text[idx] === '/' && idx < len - 1 && (!idx || text[idx - 1] !== '\\')) {
            if (text[idx + 1] === '/') {
                regExIdx = -1;
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
                regExIdx = -1;
                var end = text.indexOf('*/', idx + 2);
                var keep = optSafe && idx < len - 2 && text[idx + 2] === '!';
                if (keep) {
                    if (end < 0) {
                        s += text.substr(idx, len - idx);
                    } else {
                        s += text.substr(idx, end - idx + 2);
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
            regExIdx = idx; // possible regular expression start;
        }

        if (isHtml && text[idx] === '<' && idx < len - 3 && text.substr(idx + 1, 3) === '!--') {
            regExIdx = -1;
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
                regExIdx = -1;
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
            if (isInsideRegEx()) {
                continue;
            }
            if (closeIdx < 0) {
                break;
            }
            s += text.substr(idx + 1, closeIdx - idx);
            idx = closeIdx;
        }

    } while (++idx < len);

    function isInsideRegEx() {
        if (regExIdx >= 0) {
            var lb = text.indexOf(EOL, regExIdx + 1);
            var line = text.substr(regExIdx, lb < 0 ? (len - regExIdx) : (lb - regExIdx));
            var startIdx = idx - regExIdx + 1;
            var l = line.length, nextIdx = startIdx;
            do {
                if (line[nextIdx] === '/' && (nextIdx === l - 1 || line[nextIdx + 1] !== '/') && (nextIdx === startIdx || line[nextIdx - 1] !== '\\')) {
                    return true;
                }
            } while (++nextIdx < l);
        }
        return false;
    }

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
