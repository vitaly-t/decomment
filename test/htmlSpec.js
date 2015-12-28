'use strict';

// Tests for HTML comments;

var decomment = require('../');
var os = require('os');
var LB = os.EOL;

describe("HTML:", function () {

    describe("empty html", function () {
        it("must be intact", function () {
            expect(decomment("\<\>/*hello*/")).toBe("\<\>/*hello*/");
            expect(decomment("\<text\>//something")).toBe("\<text\>//something");
        });
    });

    describe("single-line comment", function () {
        it("must be gone", function () {
            expect(decomment("\<!--text--\>")).toBe("");
            expect(decomment("\<!--text--\>" + LB)).toBe("");
            // note: spaces and tabs are removed from empty lines;
            expect(decomment("\t \t \<!--text--\>" + LB)).toBe("");
        });
    });

    describe("multi-line comment", function () {
        it("must be gone", function () {
            expect(decomment("\<!-- some" + LB + "text" + LB + "--\>")).toBe("");
        });
    });

});
