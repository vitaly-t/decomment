'use strict';

var parser = require('./parser');

function main(code, options) {
    return parser(code, options, {
        parse: true // need to parse;
    });
}

main.text = function (text, options) {
    return parser(text, options, {
        parse: false, // do not need to parse;
        html: false // treat as plain text;
    });
};

main.html = function (html, options) {
    return parser(html, options, {
        parse: false, // do not need to parse;
        html: true // treat as HTML;
    });
};

module.exports = main;
