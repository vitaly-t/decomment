'use strict';

var os = require('os');

function decomment(text) {

    if (typeof text !== 'string') {
        throw new TypeError("A text string was expected.");
    }

    if (!text.length) {
        return text;
    }

    var idx = 0, // current index;
        s = '', // resulting text;
        len = text.length, // text length;
        emptyLine = true, // set while no symbols encountered on the current line;
        emptyLetters = '', // empty letters on a new line;
        regExIdx = -1; // first possible regEx index in the current line;

    do {
        if (text[idx] === '/' && idx < len - 1 && (!idx || text[idx - 1] !== '\\')) {
            if (text[idx + 1] === '/') {
                regExIdx = -1;
                var lb = text.indexOf(os.EOL, idx + 1);
                if (lb < 0) {
                    break;
                }
                if (emptyLine) {
                    emptyLetters = '';
                    idx = lb + os.EOL.length - 1; // last symbol of the line break;
                } else {
                    idx = lb - 1; // just before the line break;
                }
                continue;
            }
            if (text[idx + 1] === '*') {
                regExIdx = -1;
                var end = text.indexOf('*/', idx + 1);
                if (end < 0) {
                    break;
                }
                idx = end + 1;
                if (emptyLine) {
                    emptyLetters = '';
                    var lb = text.indexOf(os.EOL, idx + 1);
                    if (lb > idx) {
                        idx = lb + os.EOL.length - 1; // last symbol of the line break;
                    }
                }
                continue;
            }
            if (regExIdx < 0) {
                regExIdx = idx; // possible regular expression start;
            }
        }

        var symbol = text[idx];
        var isSpace = symbol === ' ' || symbol === '\t';
        if (symbol === '\r' || symbol === '\n') {
            if (text.indexOf(os.EOL, idx) === idx) {
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

        if (symbol === '\'' || symbol === '"' || symbol === '`') {
            var closeIdx = idx;
            do {
                closeIdx = text.indexOf(symbol, closeIdx + 1);
            } while (closeIdx > 0 && text[closeIdx - 1] === '\\');
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
        if (regExIdx < 0) {
            return false;
        }
        var lb = text.indexOf(os.EOL, regExIdx + 1);
        var line = text.substr(regExIdx, lb < 0 ? (len - regExIdx) : (lb - regExIdx));
        var startIdx = idx - regExIdx + 1; // local index that follows the symbol;
        var l = line.length, nextIdx = startIdx;
        do {
            if (line[nextIdx] === '/' && (nextIdx === l - 1 || line[nextIdx] !== '/') && (nextIdx === startIdx || line[nextIdx - 1] !== '\\')) {
                return true; // regEx closure found;
            }
        } while (++nextIdx < l);
        return true;
    }

    return s;
}

module.exports = decomment;
