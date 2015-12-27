'use strict';

// Tests for combinations of single + multi-line comments;

var decomment = require('../');
var os = require('os');
var LB = os.EOL;

describe("Mixed:", function () {

    describe("single-line gaps", function () {
        it("must be removed", function () {
            expect(decomment("//one" + LB + "//two" + LB + "//three")).toBe("");
        });
    });

    describe("multi-line gaps", function () {
        it("must be removed", function () {
            expect(decomment("/*one*/" + LB + "/*two*/" + LB + "/*three*/")).toBe("");
        });
    });

});
