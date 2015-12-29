'use strict';

// Tests for skipping regular expressions;

var decomment = require('../');
var os = require('os');
var LB = os.EOL;

describe("RegEx:", function () {

    describe("with apostrophe", function () {
        it("must ignore the apostrophe", function () {
            expect(decomment("/'/")).toBe("/'/");
            expect(decomment("/'/" + LB)).toBe("/'/" + LB);
            expect(decomment("/\'/")).toBe("/'/");
            // TODO:
            // expect(decomment("/\/\'/")).toBe("//'/"); // FAIL
        });
    });

    describe("with a quote", function () {
        it("must ignore the quote", function () {
            expect(decomment('/"/')).toBe('/"/');
            expect(decomment('/"/' + LB)).toBe('/"/' + LB);
            expect(decomment('/\"/')).toBe('/"/');
            // TODO:
            // expect(decomment('/\/\"/')).toBe('//"/'); // FAIL
        });
    });

    describe("with an es6 apostrophe", function () {
        it("must ignore the apostrophe", function () {
            expect(decomment('/`/')).toBe('/`/');
            expect(decomment('/`/' + LB)).toBe('/`/' + LB);
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

    describe("unfinished regex", function () {
        it("must remain unchanged", function () {
            expect(decomment("/'")).toBe("/'");
            expect(decomment("/'//")).toBe("/'"); // Cutting invalid JavaScript;
        });
    });

    describe("comments inside text, between dividers", function () {
        it("must ignore the comment", function () {
            expect(decomment("func(1 * 2, '//', 3 / 4)")).toBe("func(1 * 2, '//', 3 / 4)");

            expect(decomment("func(1 / 2, '//', 3 * 4)")).toBe("func(1 / 2, '//', 3 * 4)");
            expect(decomment("func(1 / 2, '//', 3 / 4)")).toBe("func(1 / 2, '//', 3 / 4)");

            // TODO:
            // expect(decomment("func(1 / 2, '/**/', 3 * 4)")).toBe("func(1 / 2, '/**/', 3 * 4)"); // FAIL
            // expect(decomment("func(1 / 2, '/**/', 3 / 4)")).toBe("func(1 / 2, '/**/', 3 / 4)"); // FAIL
        });
    });
});
