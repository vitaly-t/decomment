var RemoveComments = require('../lib/remover');

var fs = require('fs');

fs.readFile('input.js', 'utf8', function (err, data) {
    if (err)
        throw err;

    fs.writeFile("output.js", RemoveComments(data));
});
