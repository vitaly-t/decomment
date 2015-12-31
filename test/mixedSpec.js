'use strict';

// Tests for combinations of single + multi-line comments;

var decomment = require('../lib');
var os = require('os');
var LB = os.EOL;

describe("Mixed:", function () {

    describe("special slash case", function () {
        it("must be ignored", function () {
            expect(decomment("'\f'")).toBe("'\f'");
            expect(decomment("'\\\\'")).toBe("'\\\\'");
        });
    });

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

    describe("mixed comments", function () {
        it("must be removed", function () {
            expect(decomment("//one" + LB + "/*two*/" + LB + "//three")).toBe("");
        });
    });

});
