'use strict';

// Tests for combinations of single + multi-line comments;

var CommentsRemover = require('../lib/remover');
var cr = new CommentsRemover();

describe("Mixed:", function () {

    beforeEach(function () {
        cr.reset();
    });

});