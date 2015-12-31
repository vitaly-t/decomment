decomment
=========

Removes comments from JSON, JavaScript, CSS and HTML.

[![Build Status](https://travis-ci.org/vitaly-t/decomment.svg?branch=master)](https://travis-ci.org/vitaly-t/decomment)
[![Coverage Status](https://coveralls.io/repos/vitaly-t/decomment/badge.svg?branch=master)](https://coveralls.io/r/vitaly-t/decomment?branch=master)

## Installing

```
$ npm install decomment
```

## Testing

```
$ npm test
```

Testing with coverage:
```
$ npm run coverage
```

## Usage

```js
var decomment = require('decomment');

var text = "var t; // comments";

decomment(text); //=> var t;
```

NOTE: Specifically for CSS, call `decomment.css(text, [options])` instead.

## Features

* Removes both single and multi-line comments from JSON, JavaScript and CSS
* Automatically recognizes HTML and removes all `<!-- comments -->` from it
* Does not change layout / formatting of the original document
* Removes lines that have only comments on them
* Compatible with CSS3, JSON5 and ECMAScript 6

The library does not support mixed content - HTML with JavaScript or CSS in it.
Once the input code is recognized as HTML, only the HTML comments will be removed from it.

## Performance

This library uses [esprima] to guarantee correct processing for regular expressions.

As an example of performance, it can process [AngularJS 1.5 Core](https://code.angularjs.org/1.5.0-rc.0/angular.js)
in under 200ms. That's 1.1MB ~ 30,000 lines of JavaScript, with 111 regular expressions in it.   

## API

#### decomment(text, [options]) ⇒ String

##### options.trim ⇒ Boolean
* `false (default)` - do not trim comments
* `true` - remove empty lines that follow removed full-line comments

Examples:
 
```js
var text = "/* comment */\r\n\r\n var test = 123"; 
decomment(text); //=> \r\n var test = 123
decomment(text, {trim: true}); //=> var test = 123
```

##### options.safe ⇒ Boolean
* `false (default)` - remove all multi-line comments
* `true` - keep multi-line comments that start with `/*!`

Examples:

```js
var text = "/*! special */ js code /* normal */";
decomment(text); //=> js code
decomment(text, {safe: true}); //=> /*! special */ js code
```

This option has no effect when processing HTML.

#### decomment.css(text, [options]) ⇒ String

The same as **decomment**, but specific to processing CSS.

## License

Copyright © 2016 [Vitaly Tomilov](https://github.com/vitaly-t);
Released under the MIT license.

[esprima]:https://github.com/jquery/esprima
