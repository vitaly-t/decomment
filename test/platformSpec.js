'use strict';

// EOL tests;

var decomment = require('../lib');
var LB = require('os').EOL;

describe("EOL:", function () {

    describe("unknown", function () {
        it("must break lines according to the OS", function () {
            expect(decomment("//comment" + LB + LB + "text", {trim: true, platform: 'unknown'})).toBe("text");
        });
    });

    describe("windows", function () {
        it("must skip solo \\n symbols", function () {
            expect(decomment("//comment\n\ntext", {trim: true, platform: 'windows'})).toBe("");
            expect(decomment("/*comment*/\n\ntext", {trim: true, platform: 'windows'})).toBe("\n\ntext");
        });

        it("must skip solo \\r symbols", function () {
            expect(decomment("//comment\r\rtext", {trim: true, platform: 'windows'})).toBe("");
            expect(decomment("/*comment*/\r\rtext", {trim: true, platform: 'windows'})).toBe("\r\rtext");
        });

        it("must trim and ignore case", function () {
            expect(decomment("//comment\n\ntext", {trim: true, platform: '\t WindowS '})).toBe("");
        });

    });

    describe("unix", function () {
        it("must ignore \\r symbols", function () {
            expect(decomment("//comment\r\rtext", {trim: true, platform: 'unix'})).toBe("");
            expect(decomment("/*comment*/\r\rtext", {trim: true, platform: 'unix'})).toBe("\r\rtext");
        });
        it("must break lines on any \\n symbol", function () {
            expect(decomment("//comment\n\ntext", {trim: true, platform: 'unix'})).toBe("text");
            expect(decomment("/*comment*/\n\ntext", {trim: true, platform: 'unix'})).toBe("text");
        });
    });

    describe("auto", function () {
        it("must always ignore solo \\r symbols", function () {
            expect(decomment("//comment\r\rtext", {trim: true, platform: 'auto'})).toBe("");
            expect(decomment("/*comment*/\r\rtext", {trim: true, platform: 'auto'})).toBe("\r\rtext");
        });
        it("must determine Unix and break on \\n", function () {
            expect(decomment("//comment\n\ntext", {trim: true, platform: 'auto'})).toBe("text");
            expect(decomment("/*comment*/\n\ntext", {trim: true, platform: 'auto'})).toBe("text");
        });
        it("must determine Windows and break on \\r\\n", function () {
            expect(decomment("//comment\r\n\r\ntext", {trim: true, platform: 'auto'})).toBe("text");
            expect(decomment("/*comment*/\r\n\r\ntext", {trim: true, platform: 'auto'})).toBe("text");
        });
    });

});
