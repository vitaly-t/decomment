'use strict';

var EOL = require('os').EOL; // OS-dependent End-of-Line;

////////////////////////////////////////////////////////////
// Converts a dictionary of relative regEx coordinates
// into an array of absolute coordinates: [{start, end},...]
function regExAbsolute(code, relativeDict) {
    var lineIdx = 0, idx = 0, result = [], lb;
    do {
        if (lineIdx in relativeDict) {
            var d = relativeDict[lineIdx];
            for (var i = 0; i < d.length; i++) {
                result.push({
                    start: d[i].start + idx,
                    end: d[i].end + idx
                });
            }
        }
        lb = code.indexOf(EOL, idx);
        if (lb >= 0) {
            idx = lb + EOL.length;
            lineIdx++;
        }
    } while (lb >= 0);
    return result;
}

///////////////////////////////////////////////////////////////////////
// Executes a linear search through an array of absolute regEx indexes,
// to find whether the passed index is inside one of the regEx entries.
function indexInRegEx(idx, regExData) {
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

//////////////////////////////////////////////////////
// Searches for the next occurrence of an expression,
// while also counting the line breaks encountered.
//
// - if expression is found, it returns {idx, lines};
// - if expression is not found, it returns null.
function indexOf(source, expression, startIdx) {
    var expIdx = source.indexOf(expression, startIdx);
    if (expIdx < 0) {
        return null; // not found;
    }
    var idx = expIdx - 1, count = 0, lb;
    do {
        lb = source.lastIndexOf(EOL, idx);
        if (lb >= 0) {
            if (lb >= startIdx) {
                count++;
            }
            idx = lb - 1;
        }
    } while (idx > startIdx && lb >= 0);
    return {
        idx: expIdx, // index in the source where the expression was found;
        lines: count // number of line breaks found before the expression;
    };
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
    regExAbsolute: regExAbsolute,
    indexInRegEx: indexInRegEx,
    indexOf: indexOf,
    isHtml: isHtml
};
