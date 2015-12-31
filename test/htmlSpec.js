'use strict';

// Tests for HTML comments;

var decomment = require('../lib');
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

    describe("unclosed comment", function () {
        it("must be gone", function () {
            expect(decomment("\<!-- text")).toBe("");
            expect(decomment("\<!-- text" + LB)).toBe("");
        });
    });

    describe("with text that follows", function () {
        it("only the text must be left", function () {
            expect(decomment("\<!-- comment -->text")).toBe("text");
            expect(decomment("\<!-- comment -->\ttext")).toBe("\ttext");
        });
    });

    describe("with prefix text", function () {
        it("only the text must be left", function () {
            expect(decomment("\<html\>prefix<!-- comment -->")).toBe("\<html\>prefix");
            expect(decomment("\<html\>prefix<!-- comment -->" + LB)).toBe("\<html\>prefix" + LB);
        });
    });

});
