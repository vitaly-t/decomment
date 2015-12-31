'use strict';

var parser = require('./parser');

function main(text, options) {
    return parser(text, options, false);
}

main.css = function (text, options) {
    return parser(text, options, true);
};

module.exports = main;
