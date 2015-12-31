'use strict';

var core = require('./core');

function main(text, options) {
    return core(text, options, false);
}

main.css = function (text, options) {
    return core(text, options, true);
};

module.exports = main;
