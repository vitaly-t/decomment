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
var validCode = "var t; // comment";
console.log(decomment(validCode));
//=> var t;
```
