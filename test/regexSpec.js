'use strict';

// Tests for skipping regular expressions;

var decomment = require('../');
var os = require('os');
var LB = os.EOL;

describe("RegEx:", function () {

    // TODO: The following is a valid regEx:
    // /\/*[\-/']/;
    // Problem: Symbol `/` inside regEx can have just about any preceding symbol.
    // So, my strategy with the regEx index moving forward doesn't work,
    // I find a new tag inside regEx and that breaks things.

    describe("with apostrophe", function () {
        it("must ignore the apostrophe", function () {
            expect(decomment("/'/")).toBe("/'/");
            expect(decomment("/'/" + LB)).toBe("/'/" + LB);
            expect(decomment("/\'/")).toBe("/'/");
            expect(decomment("/'\/text")).toBe("/'\/text");
        });
    });

    describe("with a quote", function () {
        it("must ignore the quote", function () {
            expect(decomment('/"/')).toBe('/"/');
            expect(decomment('/"/' + LB)).toBe('/"/' + LB);
            expect(decomment('/\"/')).toBe('/"/');
            expect(decomment('/"\/text')).toBe('/"\/text');
            expect(decomment('/"\/\/text')).toBe('/"');
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

            //expect(decomment("func(1 / 2, '//', 3 * 4)")).toBe("func(1 / 2, '//', 3 * 4)");

            expect(decomment("func(1 * 2, '/text/', 3 / 4)")).toBe("func(1 * 2, '/text/', 3 / 4)");
            expect(decomment("func(1 * 2, '/some\/text/', 3 / 4)")).toBe("func(1 * 2, '/some/text/', 3 / 4)");

            //expect(decomment("func(1 / 2, '/text/', 3 / 4)")).toBe("func(1 / 2, '/text/', 3 / 4)");
            //expect(decomment("func(1 / 2, '/some\/text//', 3 / 4)")).toBe("func(1 / 2, '/some/text//', 3 / 4)");

            //expect(decomment("func(1 / 2, '/**/', 3 * 4)")).toBe("func(1 / 2, '/**/', 3 * 4)");
            //expect(decomment("func(1 / 2, '/**/', 3 / 4)")).toBe("func(1 / 2, '/**/', 3 / 4)");

            //expect(decomment("a/'/*text*/'")).toBe("a/'/*text*/'");

            // Warning: below is a synthetic test, because it is not a valid JavaScript;
            expect(decomment("/ 2, '/\/*/'")).toBe("/ 2, '");
        });
    });

    describe("valid regular expressions", function () {
        it("must repent any content", function () {
            expect(decomment("=/'/")).toBe("=/'/");
            expect(decomment(LB + "=/'/")).toBe(LB + "=/'/");
            expect(decomment("/[']/")).toBe("/[']/");
        });
    });
});
