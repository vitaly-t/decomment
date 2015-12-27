decomment
===========

Removes comments from JavaScript and JSON.

[![Build Status](https://travis-ci.org/vitaly-t/decomment.svg?branch=master)](https://travis-ci.org/vitaly-t/decomment)

### Installing

```
$ npm install decomment
```

### Testing

```
$ npm test
```

Testing with coverage:
```
$ npm run coverage
```

### Usage

```js
var decomment = require('decomment');

var code = "var t; // comments"; // any valid JavaScript or JSON

console.log(decomment(code)); //=> var t;
```

The library is compliant with ECMAScript 6, and can handle any valid JavaScript
or JSON input of any size.
