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

    describe("with EOL after the empty line + comment", function () {
        cr.reset();
        var out = cr.next("/**/" + LB);
        it("must remove the line break", function () {
            expect(out).toBe("");
        });
    });

    describe("with EOL after non-empty line + comment", function () {
        cr.reset();
        var out = cr.next("Text/**/" + LB);
        it("must keep the line break", function () {
            expect(out).toBe("Text" + LB);
        });
    });
});
