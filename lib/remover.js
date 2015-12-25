'use strict';

var os = require('os');

// TODO: Detect and track when inside text - DONE!
// TODO: Detect and skip redundant EOL - DONE, but needs to be optional?
// TODO: Detect comments open + close across pages;

function CommentsRemover() {

    var inText, // set when inside an unfinished text block;
        textOpener, // text opener, if inside an unfinished text block;
        inComment, // set when inside an unfinished comment block;
        single, // set when inside a single-line unfinished comment block;
        emptyLine, // set while no symbols encountered on the current line;
        lastSymbol; // last symbol from the previous text page.

    this.reset = function () {
        inText = false; // not inside a text block;
        inComment = false; // not inside a comment block;
        emptyLine = true; // no symbols found yet;
        lastSymbol = undefined; // no previous data;
    };

    this.reset();

    this.next = function (text) {

        if (typeof text !== 'string' || !text.length) {
            throw new TypeError("Non-empty text string was expected.");
        }

        var idx = 0, // current index;
            s = '', // resulting text;
            len = text.length; // text length;
        do {
            if (text[idx] === '/' && idx < len - 1 && text[idx + 1] === '/') {
                if (!inText && !inComment) {
                    var lb = text.indexOf(os.EOL, idx + 1);
                    if (lb > idx) {
                        if (emptyLine) {
                            idx = lb + os.EOL.length - 1; // last symbol of the line break;
                        } else {
                            idx = lb - 1; // just before the line break;
                        }
                        continue;
                    }
                    inComment = true;
                    single = true;
                    break;
                }
            }

            if (text[idx] === '/' && idx < len - 1 && text[idx + 1] === '*') {
                if (!inText && !inComment) {
                    var end = text.indexOf('*/', idx + 1);
                    if (end > idx) {
                        idx = end + 1;
                        if (emptyLine) {
                            var lb = text.indexOf(os.EOL, idx + 1);
                            if (lb > idx) {
                                idx = lb + os.EOL.length - 1; // last symbol of the line break;
                            }
                        }
                        continue;
                    }
                    inComment = true;
                    single = false;
                    break;
                }
            }

            if (!inComment) {
                var symbol = text[idx];
                s += symbol;
                if (emptyLine) {
                    emptyLine = symbol === ' ' || symbol === '\t' || symbol === '\r' || symbol === '\n';
                }
                if (!inText && (symbol === '\'' || symbol === '"' || symbol === '`')) {
                    var closeIdx = idx + 1;
                    do {
                        closeIdx = text.indexOf(symbol, closeIdx);
                    } while (closeIdx > 0 && text[closeIdx - 1] === '\\');
                    if (closeIdx < 0) {
                        inText = true;
                        textOpener = symbol;
                    } else {
                        s += text.substr(idx + 1, closeIdx - idx);
                        idx = closeIdx;
                    }
                }
            }
        } while (++idx < len);
        lastSymbol = text[len - 1];
        return s;
    };
}

module.exports = CommentsRemover;
