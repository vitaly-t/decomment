'use strict';

var os = require('os');

// TODO: 1. Detect comments open + close across pages;
// TODO: 2. Detect when // or /* or LB are broken by pages;

// TODO: BUG: \/* can be inside a regular expression;
// TODO: BUG: /\/*\//;
// TODO: BUG: ', "", ` inside regex'
// TODO: Really, need to detect RegEx and add inRegex mode;

// SEE: https://github.com/sindresorhus/strip-json-comments/issues/26
// SEE: http://stackoverflow.com/questions/5519596/when-parsing-javascript-what-determines-the-meaning-of-a-slash

// TODO: The ony way forward is to implement a way to determine beginning and end of
// TODO: Regular Expressions, no other way round it :(

function CommentsRemover() {

    var inText, // set when inside an unfinished text block;
        textOpener, // text opener, if inside an unfinished text block;
        inComment, // set when inside an unfinished comment block;
        single, // set when inside a single-line unfinished comment block;
        emptyLine, // set while no symbols encountered on the current line;
        emptyLetters, // empty letters on a new line;
        lastSymbol; // last symbol from the previous text page.

    this.reset = function () {
        inText = false; // not inside a text block;
        inComment = false; // not inside a comment block;
        emptyLine = true; // no symbols found yet;
        lastSymbol = undefined; // no previous data;
        emptyLetters = '';
    };

    this.reset();

    this.next = function (text) {

        if (typeof text !== 'string' || !text.length) {
            throw new TypeError("Non-empty text string was expected.");
        }

        var idx = 0, // current index;
            s = '', // resulting text;
            len = text.length; // text length;
        /*
         if (inComment) {
         if (single) {
         var lb = text.indexOf(os.EOL);
         if (lb >= 0) {
         if (emptyLine) {
         emptyLetters = '';
         idx = lb + os.EOL.length - 1; // last symbol of the line break;
         } else {
         idx = lb - 1; // just before the line break;
         }
         inComment = false;
         } else {
         return s;
         }
         } else {

         }
         }
         */
        do {
            // this part: && (!idx || text[idx - 1] !== '\\')
            // is for inside regular expressions, that may need to be revisited;
            if (text[idx] === '/' && idx < len - 1 && text[idx + 1] === '/' && (!idx || text[idx - 1] !== '\\')) {
                if (!inText && !inComment) {
                    var lb = text.indexOf(os.EOL, idx + 1);
                    if (lb > idx) {
                        if (emptyLine) {
                            emptyLetters = '';
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

            // this part: && (!idx || text[idx - 1] !== '\\')
            // is for inside regular expressions, that may need to be revisited;
            if (text[idx] === '/' && idx < len - 1 && text[idx + 1] === '*' && (!idx || text[idx - 1] !== '\\')) {
                if (!inText && !inComment) {
                    var end = text.indexOf('*/', idx + 1);
                    if (end > idx) {
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
                    inComment = true;
                    single = false;
                    break;
                }
            }

            if (!inComment) {
                var symbol = text[idx];
                var isSpace = symbol === ' ' || symbol === '\t';
                if (symbol === '\r' || symbol === '\n') {
                    if (text.indexOf(os.EOL, idx) === idx) {
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

                if (!inText && (symbol === '\'' || symbol === '"' || symbol === '`')) {
                    var closeIdx = idx;
                    do {
                        closeIdx = text.indexOf(symbol, closeIdx + 1);
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
