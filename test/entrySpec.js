'use strict';

// Entry tests;

var decomment = require('../');

describe("Single:", function () {

    describe("non-string input", function () {
        it("must throw an error", function () {
            expect(function () {
                decomment();
            }).toThrow(new TypeError("A text string was expected."));
        });
    });

    describe("empty string input", function () {
        it("must return empty string", function () {
            expect(decomment("")).toBe("");
        });
    });
});
