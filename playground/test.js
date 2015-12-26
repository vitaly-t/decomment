var CommentsRemover = require('../lib/remover');

function stream(source, dest) {
    var cr = new CommentsRemover();

    function processData(data) {
        dest.write(cr.next(data));
    }

    source.on('data', processData);
    source.once('end', function () {
        source.removeListener('data', processData);
    });
}

var fs = require('fs');
var s = fs.createReadStream('input.js');
//var out = fs.createWriteStream('output.js');
s.setEncoding('utf8');

stream(s, process.stdout);
