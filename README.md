decomment
===========

Removes comments from JSON or JavaScript.

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

var code = "var t; // comments"; // any valid JSON or JavaScript

console.log(decomment(code)); //=> var t;
```

### Features

* Removes both single-line and multi-line comments
* Removes unnecessary gaps left by comment blocks
* Can handle valid JSON or JavaScript of any size
* Compliant with ECMAScript 6
