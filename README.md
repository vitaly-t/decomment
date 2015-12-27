decomment
===========

Removes comments from JSON or JavaScript.

[![Build Status](https://travis-ci.org/vitaly-t/decomment.svg?branch=master)](https://travis-ci.org/vitaly-t/decomment)
[![Coverage Status](https://coveralls.io/repos/vitaly-t/decomment/badge.svg?branch=master)](https://coveralls.io/r/vitaly-t/decomment?branch=master)

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

* Removes both single and multi-line comments
* Removes unnecessary gaps left by comment blocks
* Does not change the resulting layout / formatting
* Can handle valid JSON or JavaScript of any size
* Compliant with ECMAScript 6

In terms of the performance, this library is as fast as it gets, in part because it makes no use of regular expressions.

For example, it churns through [AngularJS 1.5 Core](https://code.angularjs.org/1.5.0-rc.0/angular.js) (1.1MB ~ 30,000 lines of JavaScript) in under 40ms. 
