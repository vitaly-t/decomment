'use strict';

var esprima = require('esprima');

////////////////////////////////////////////////////////////////////
// Tokenizes JSON or JavaScript via Esprima, enumerates and returns
// all regular expressions as an array of absolute location indexes
// within the source: [{start, end}, {start, end},...]
function parseRegEx(code) {
    var result = [];
    // NOTE: Even though we do not need the location details,
    // using option `loc` makes `tokenize` perform 40% faster.
    esprima.tokenize(code, {loc: true, range: true}, function (node) {
        if (node.type === 'RegularExpression') {
            result.push({
                start: node.range[0] + 1, // next after the opening `/`
                end: node.range[1] - 1 // previous to the closing `/`
            });
        }
    });
    return result;
}

///////////////////////////////////////////////////////////////////////
// Executes a linear search through an array of absolute regEx indexes,
// to find whether the passed index is inside one of the regEx entries.
function indexInRegEx(idx, regExData) {
    // regExData - the output provided by parseRegEx;
    var mid, low = 0, high = regExData.length - 1;
    while (low <= high) {
        mid = Math.round((low + high) / 2);
        var a = regExData[mid];
        if (idx >= a.start) {
            if (idx <= a.end) {
                return true;
            }
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return false;
}

////////////////////////////////////////////////
// Checks the text for being HTML, by verifying
// whether `<` is the first non-empty symbol.
function isHtml(text) {
    var s, idx = 0;
    do {
        s = text[idx];
        if (s !== ' ' && s !== '\t' && s !== '\r' && s !== '\n') {
            return s === '<';
        }
    } while (++idx < text.length);
}

module.exports = {
    parseRegEx: parseRegEx,
    indexInRegEx: indexInRegEx,
    isHtml: isHtml
};
