'use strict';

var utils = require('./utils');

function parser(code, options, config) {

    if (typeof code !== 'string') {
        throw new TypeError('Input code/text/html must be a string.');
    }

    if (options !== undefined && typeof(options) !== 'object') {
        throw new TypeError('Parameter \'options\' must be an object.');
    }

    var idx = 0, // current index;
        s = '', // resulting code;
        len = code.length, // code length;
        emptyLine = true, // set while no symbols encountered on the current line;
        emptyLetters = '', // empty letters on a new line;
        optSafe = options && options.safe, // 'safe' option;
        optSpace = options && options.space, // 'space' option;
        optTrim = options && options.trim, // 'trim' option;
        EOL = utils.getEOL(code), // get EOL from the code;
        isHtml, // set when the input is recognized as HTML;
        regEx = []; // regular expression details;

    if (!len) {
        return code;
    }

    if (config.parse) {
        isHtml = utils.isHtml(code);
        if (!isHtml) {
            regEx = utils.parseRegEx(code);
        }
    } else {
        isHtml = config.html;
    }

    if (options && options.ignore) {
        var ignore = options.ignore;
        if (ignore instanceof RegExp) {
            ignore = [ignore];
        } else {
            if (ignore instanceof Array) {
                ignore = ignore.filter(function (f) {
                    return f instanceof RegExp;
                });
                if (!ignore.length) {
                    ignore = null;
                }
            } else {
                ignore = null;
            }
        }
        if (ignore) {
            for (var i = 0; i < ignore.length; i++) {
                var match, reg = ignore[i];
                do {
                    match = reg.exec(code);
                    if (match) {
                        regEx.push({
                            start: match.index,
                            end: match.index + match[0].length - 1
                        });
                    }
                } while (match && reg.global);
            }
            regEx = regEx.sort(function (a, b) {
                return a.start - b.start;
            });
        }
    }

    do {
        if (!isHtml && code[idx] === '/' && idx < len - 1 && (!idx || code[idx - 1] !== '\\')) {
            if (code[idx + 1] === '/') {
                if (inRegEx()) {
                    if (emptyLetters) {
                        s += emptyLetters;
                        emptyLetters = '';
                    }
                    s += '/';
                    continue;
                }
                var lb1 = code.indexOf(EOL, idx + 2);
                if (lb1 < 0) {
                    break;
                }
                if (emptyLine) {
                    emptyLetters = '';
                    if (optSpace) {
                        idx = lb1 - 1; // just before the line break;
                    } else {
                        idx = lb1 + EOL.length - 1; // last symbol of the line break;
                        trim();
                    }
                } else {
                    idx = lb1 - 1; // just before the line break;
                }
                continue;
            }
            if (code[idx + 1] === '*') {
                if (inRegEx()) {
                    if (emptyLetters) {
                        s += emptyLetters;
                        emptyLetters = '';
                    }
                    s += '/';
                    continue;
                }
                var end1 = code.indexOf('*/', idx + 2);
                var keep1 = optSafe && idx < len - 2 && code[idx + 2] === '!';
                if (keep1) {
                    if (end1 >= 0) {
                        s += code.substr(idx, end1 - idx + 2);
                    } else {
                        s += code.substr(idx, len - idx);
                    }
                }
                if (end1 < 0) {
                    break;
                }
                var comment1 = code.substr(idx, end1 - idx + 2);
                idx = end1 + 1;
                if (emptyLine) {
                    emptyLetters = '';
                }
                if (!keep1) {
                    var parts1 = comment1.split(EOL);
                    if (optSpace) {
                        for (var k1 = 0; k1 < parts1.length - 1; k1++) {
                            s += EOL;
                        }
                    }
                    var lb2 = code.indexOf(EOL, idx + 1);
                    if (lb2 > idx) {
                        var gapIdx1 = lb2 - 1;
                        while ((code[gapIdx1] === ' ' || code[gapIdx1] === '\t') && --gapIdx1 > idx) ;
                        if (gapIdx1 === idx) {
                            if (emptyLine && !optSpace) {
                                idx = lb2 + EOL.length - 1; // last symbol of the line break;
                                trim();
                            }
                        } else {
                            if (optSpace) {
                                s += utils.getSpaces(parts1[parts1.length - 1].length);
                            }
                        }
                    } else {
                        if (optSpace) {
                            var gapIdx2 = idx + 1;
                            while ((code[gapIdx2] === ' ' || code[gapIdx2] === '\t') && ++gapIdx2 < len) ;
                            if (gapIdx2 < len) {
                                s += utils.getSpaces(parts1[parts1.length - 1].length);
                            }
                        }
                    }
                }
                continue;
            }
        }

        if (isHtml && code[idx] === '<' && idx < len - 3 && code.substr(idx + 1, 3) === '!--') {
            if (inRegEx()) {
                if (emptyLetters) {
                    s += emptyLetters;
                    emptyLetters = '';
                }
                s += '<';
                continue;
            }
            var end2 = code.indexOf('-->', idx + 4);
            var keep2 = optSafe && code.substr(idx + 4, 3) === '[if';
            if (keep2) {
                if (end2 >= 0) {
                    s += code.substr(idx, end2 - idx + 3);
                } else {
                    s += code.substr(idx, len - idx);
                }
            }
            if (end2 < 0) {
                break;
            }
            var comment2 = code.substr(idx, end2 - idx + 3);
            idx = end2 + 2;
            if (emptyLine) {
                emptyLetters = '';
            }
            if (!keep2) {
                var parts2 = comment2.split(EOL);
                if (optSpace) {
                    for (var k2 = 0; k2 < parts2.length - 1; k2++) {
                        s += EOL;
                    }
                }
                var lb3 = code.indexOf(EOL, idx + 1);
                if (lb3 > idx) {
                    var gapIdx3 = lb3 - 1;
                    while ((code[gapIdx3] === ' ' || code[gapIdx3] === '\t') && --gapIdx3 > idx) ;
                    if (gapIdx3 === idx) {
                        if (emptyLine && !optSpace) {
                            idx = lb3 + EOL.length - 1; // last symbol of the line break;
                            trim();
                        }
                    } else {
                        if (optSpace) {
                            s += utils.getSpaces(parts2[parts2.length - 1].length);
                        }
                    }
                } else {
                    if (optSpace) {
                        var gapIdx4 = idx + 1;
                        while ((code[gapIdx4] === ' ' || code[gapIdx4] === '\t') && ++gapIdx4 < len) ;
                        if (gapIdx4 < len) {
                            s += utils.getSpaces(parts2[parts2.length - 1].length);
                        }
                    }
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

        if (!isHtml && (symbol === '\'' || symbol === '"' || symbol === '`') && (!idx || code[idx - 1] !== '\\')) {
            if (inRegEx()) {
                continue;
            }
            var closeIdx = idx;
            do {
                closeIdx = code.indexOf(symbol, closeIdx + 1);
                if (closeIdx > 0) {
                    var shIdx = closeIdx;
                    while (code[--shIdx] === '\\') ;
                    if ((closeIdx - shIdx) % 2) {
                        break;
                    }
                }
            } while (closeIdx > 0);
            if (closeIdx < 0) {
                break;
            }
            s += code.substr(idx + 1, closeIdx - idx);
            idx = closeIdx;
        }

    } while (++idx < len);

    function inRegEx() {
        if (regEx.length) {
            return utils.indexInRegEx(idx, regEx);
        }
    }

    function trim() {
        if (optTrim) {
            var startIdx, endIdx, i;
            do {
                startIdx = idx + 1;
                endIdx = code.indexOf(EOL, startIdx);
                i = startIdx;
                while ((code[i] === ' ' || code[i] === '\t') && ++i < endIdx) ;
                if (i === endIdx) {
                    idx = endIdx + EOL.length - 1;
                }
            } while (i === endIdx);
        }
    }

    return s;
}

module.exports = parser;
