'use strict';

// Tests for single-line comments;

var os = require('os');
var RemoveComments = require('../lib/remover');
var LB = os.EOL;

describe("Single:", function () {

    describe("empty comment", function () {
        var out = RemoveComments("//");
        it("must return an empty string", function () {
            expect(out).toBe("");
        });
    });

    describe("multiple empty comments", function () {
        var out1 = RemoveComments("//" + LB + "//" + LB);
        var out2 = RemoveComments("//" + LB + "//");
        it("must return an empty string", function () {
            expect(out1).toBe("");
            expect(out2).toBe("");
        });
    });

    describe("non-empty comment", function () {
        var out = RemoveComments("// text");
        it("must return an empty string", function () {
            expect(out).toBe("");
        });
    });

    describe("non-empty multiple comments", function () {
        var out1 = RemoveComments("// text1" + LB + "// text2");
        var out2 = RemoveComments("// text1" + LB + "// text2" + LB);
        it("must return an empty string", function () {
            expect(out1).toBe("");
            expect(out2).toBe("");
        });
    });

    describe("with line-break prefix", function () {
        var out = RemoveComments(LB + "//");
        it("must return the break", function () {
            expect(out).toBe(LB);
        });
    });

    describe("with line-break suffix", function () {
        var out = RemoveComments("//" + LB);
        it("must return an empty string", function () {
            expect(out).toBe("");
        });
    });

    describe("with multiple line-break suffixes", function () {
        var out = RemoveComments("//" + LB + LB);
        it("must return a single line break", function () {
            expect(out).toBe(LB);
        });
    });

    describe("with preceding text", function () {
        var out1 = RemoveComments("Text//");
        var out2 = RemoveComments(LB + "Text//");
        var out3 = RemoveComments("Text" + LB + "//");
        var out4 = RemoveComments("Text//" + LB + "Here");
        it("must return the preceding text", function () {
            expect(out1).toBe("Text");
            expect(out2).toBe(LB + "Text");
            expect(out3).toBe("Text" + LB);
            expect(out4).toBe("Text" + LB + "Here");
        });
    });

    describe("with empty text prefix", function () {
        var out1 = RemoveComments("''//");
        var out2 = RemoveComments("\"\"//");
        var out3 = RemoveComments("``//");
        it("must leave only the comment", function () {
            expect(out1).toBe("''");
            expect(out2).toBe("\"\"");
            expect(out3).toBe("``");
        });
    });

    describe("with empty text suffix", function () {
        var out1 = RemoveComments("//" + LB + "''");
        var out2 = RemoveComments("//" + LB + "\"\"");
        var out3 = RemoveComments("//" + LB + "``");
        it("must leave only the comment", function () {
            expect(out1).toBe("''");
            expect(out2).toBe("\"\"");
            expect(out3).toBe("``");
        });
    });

    describe("with re-used opener", function () {
        var out1 = RemoveComments("'\''");
        var out2 = RemoveComments("\"\"\"");
        var out3 = RemoveComments("`\``");
        it("must leave only the comment", function () {
            expect(out1).toBe("'\''");
            expect(out2).toBe("\"\"\"");
            expect(out3).toBe("`\``");
        });
    });

    describe("comments inside text", function () {
        var out = RemoveComments("'//Text'");
        it("must leave only the comment", function () {
            expect(out).toBe("'//Text'");
        });
    });

    describe("spaces", function () {
        describe("before text", function () {
            var out = RemoveComments("\t \tText");
            it("must preserve the spaces", function () {
                expect(out).toBe("\t \tText");
            });
        });
        describe("after text", function () {
            var out = RemoveComments("Text\t \t");
            it("must preserve the spaces", function () {
                expect(out).toBe("Text\t \t");
            });
        });
        describe("complex case", function () {
            var out = RemoveComments("a // comment" + LB + "\tb // comment" + LB + "c//end");
            it("must keep spaces correctly", function () {
                expect(out).toBe("a " + LB + "\tb " + LB + "c");
            });
        });
    });
});
