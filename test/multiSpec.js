'use strict';

// Tests for multi-line comments;

var os = require('os');
var CommentsRemover = require('../lib/remover');
var cr = new CommentsRemover();
var LB = os.EOL;

describe("Multi:", function () {

    describe("empty comment", function () {
        cr.reset();
        var out = cr.next("/**/");
        it("must return an empty string", function () {
            expect(out).toBe("");
        });
    });

    describe("multiple empty comments", function () {
        cr.reset();
        var out1 = cr.next("/**/" + LB + "/**/" + LB);
        cr.reset();
        var out2 = cr.next("/**/" + LB + "/**/");
        it("must return an empty string", function () {
            expect(out1).toBe("");
            expect(out2).toBe("");
        });
    });

    describe("non-empty comment", function () {
        cr.reset();
        var out = cr.next("/* text*/");
        it("must return an empty string", function () {
            expect(out).toBe("");
        });
    });

    describe("non-empty multiple comments", function () {
        cr.reset();
        var out1 = cr.next("/* text1 */" + LB + "/*text2*/");
        cr.reset();
        var out2 = cr.next("/* text1 */" + LB + "/*text2*/" + LB);
        it("must return an empty string", function () {
            expect(out1).toBe("");
            expect(out2).toBe("");
        });
    });

    describe("with line-break prefix", function () {
        cr.reset();
        var out = cr.next(LB + "/**/");
        it("must return the break", function () {
            expect(out).toBe(LB);
        });
    });

    describe("with line-break suffix", function () {
        cr.reset();
        var out = cr.next("/**/" + LB);
        it("must return an empty string", function () {
            expect(out).toBe("");
        });
    });

    describe("with multiple line-break suffixes", function () {
        cr.reset();
        var out = cr.next("/**/" + LB + LB);
        it("must return a single line break", function () {
            expect(out).toBe(LB);
        });
    });

    describe("with preceding text", function () {
        cr.reset();
        var out1 = cr.next("Text/**/");
        cr.reset();
        var out2 = cr.next(LB + "Text/**/");
        cr.reset();
        var out3 = cr.next("Text" + LB + "/**/");
        cr.reset();
        var out4 = cr.next("Text/**/" + LB + "Here");
        it("must return the preceding text", function () {
            expect(out1).toBe("Text");
            expect(out2).toBe(LB + "Text");
            expect(out3).toBe("Text" + LB);
            expect(out4).toBe("Text" + LB + "Here");
        });
    });

    describe("with empty text prefix", function () {
        cr.reset();
        var out1 = cr.next("''/**/");
        cr.reset();
        var out2 = cr.next("\"\"/**/");
        cr.reset();
        var out3 = cr.next("``/**/");
        it("must leave only the comment", function () {
            expect(out1).toBe("''");
            expect(out2).toBe("\"\"");
            expect(out3).toBe("``");
        });
    });

    describe("with empty text suffix", function () {
        cr.reset();
        var out1 = cr.next("/**/" + LB + "''");
        cr.reset();
        var out2 = cr.next("/**/" + LB + "\"\"");
        cr.reset();
        var out3 = cr.next("/**/" + LB + "``");
        it("must leave only the comment", function () {
            expect(out1).toBe("''");
            expect(out2).toBe("\"\"");
            expect(out3).toBe("``");
        });
    });

    describe("comments inside text", function () {
        cr.reset();
        var out = cr.next("'/**/Text'");
        it("must leave only the comment", function () {
            expect(out).toBe("'/**/Text'");
        });
    });

    describe("spaces", function () {
        describe("complex case", function () {
            cr.reset();
            var out = cr.next("a /* comment*/" + LB + "\tb /* comment*/" + LB + "c/*end*/");
            it("must keep spaces correctly", function () {
                expect(out).toBe("a " + LB + "\tb " + LB + "c");
            });
        });
    });

});
