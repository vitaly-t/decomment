'use strict';

// Tests for skipping regular expressions;

var decomment = require('../');
var os = require('os');
var LB = os.EOL;

describe("RegEx:", function () {

    describe("with apostrophe", function () {
        it("must ignore the apostrophe", function () {
            expect(decomment("/'/")).toBe("/'/");
            expect(decomment("/\'/")).toBe("/'/");
        });
    });

    describe("with a quote", function () {
        it("must ignore the quote", function () {
            expect(decomment('/"/')).toBe('/"/');
            expect(decomment('/\"/')).toBe('/"/');
        });
    });

    describe("with an es6 apostrophe", function () {
        it("must ignore the apostrophe", function () {
            expect(decomment('/`/')).toBe('/`/');
            expect(decomment('/\`/')).toBe('/`/');
        });
    });

    describe("with a back-slash", function () {
        it("must ignore the back-slash", function () {
            expect(decomment('/\\//')).toBe('/\\//');
            expect(decomment('/\\\//')).toBe('/\\//');
        });
    });

    describe("with a multi-line", function () {
        it("must ignore the multi-line", function () {
            expect(decomment('/\\/*/')).toBe('/\\/*/');
            expect(decomment('/\\/\*/')).toBe('/\\/*/');
        });
    });

    describe("with a multi-line opener", function () {
        it("must ignore the multi-line", function () {
            expect(decomment('/\\*/')).toBe('/\\*/');
            expect(decomment('/\\\*/')).toBe('/\\*/');
        });
    });

});
