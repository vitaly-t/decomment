'use strict';

// Entry tests;

var decomment = require('../lib');

describe("Single:", function () {

    describe("non-string input", function () {
        it("must throw an error", function () {
            expect(function () {
                decomment();
            }).toThrow(new TypeError("Input code/text/html must be string."));
        });
    });

    describe("non-object options", function () {
        it("must throw an error", function () {
            expect(function () {
                decomment("", 123);
            }).toThrow(new TypeError("Parameter 'options' must be an object."));
        });
    });

    describe("empty string input", function () {
        it("must return empty string", function () {
            expect(decomment("")).toBe("");
        });
    });
});
