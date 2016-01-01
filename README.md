decomment
=========

Removes comments from JSON, JavaScript, CSS, HTML, etc.

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

var code = "var t; // comments";

decomment(code); //=> var t;
```

## Features

* Removes both single and multi-line comments from JSON, JavaScript and CSS/Text
* Automatically recognizes HTML and removes all `<!-- comments -->` from it
* Does not change layout / formatting of the original document
* Removes lines that have only comments on them
* Compatible with CSS3, JSON5 and ECMAScript 6

The library does not support mixed content - HTML with JavaScript or CSS in it.
Once the input code is recognized as HTML, only the HTML comments will be removed from it.

## Performance

This library uses [esprima] to guarantee correct processing for regular expressions.

As an example, it can process [AngularJS 1.5 Core](https://code.angularjs.org/1.5.0-rc.0/angular.js)
in under 100ms, which is 1.1MB ~ 30,000 lines of JavaScript.   

## API

### decomment(code, [options]) ⇒ String

This method first parses `code` to determine whether it is an HTML (starts with `<`),
and if so, removes all `<!-- comment -->` entries from it, according to `options`.

When `code` is not recognized as HTML, it is assumed to be either JSON or JavaScript.
In this case the code is parsed through [esprima] for ECMAScript 6 compliance, and
to extract details about regular expressions.

If [esprima] fails to validate the code, it will throw a parsing error. When successful,
this method will remove `//` and `/**/` comments according to the `options` (see below).

##### options.trim ⇒ Boolean
* `false (default)` - do not trim comments
* `true` - remove empty lines that follow removed full-line comments

Example:
 
```js
var decomment = require('decomment');
var code = "/* comment */\r\n\r\n var test = 123"; 
decomment(code); //=> \r\n var test = 123
decomment(code, {trim: true}); //=> var test = 123
```

##### options.safe ⇒ Boolean
* `false (default)` - remove all multi-line comments
* `true` - keep multi-line comments that start with `/*!`

Example:

```js
var decomment = require('decomment');
var code = "/*! special */ var a; /* normal */";
decomment(code); //=> var a;
decomment(code, {safe: true}); //=> /*! special */ var a;
```

This option has no effect when processing HTML.

### decomment.text(text, [options]) ⇒ String

Unlike the default **decomment**, it instructs the library that `text` is not
a JSON, JavaScript or HTML, rather a plain text that needs no parsing or validation,
only to remove `//` and `/**/` comments from it according to the `options`.

CSS is the most frequent example of where this method is to be used.

Example:

```js
var decomment = require('decomment');
var text = "cssClass{color:Red;}// comments";
decomment.text(text); //=> cssClass{color:Red;}
```

Please note that while comment blocks located inside `''`, `""` or \`\` are not removed,
the same as for JSON or JavaScript, you should not use this method for JSON or JavaScript,
as it can break your regular expressions.

### decomment.html(html, [options]) ⇒ String

Unlike the default **decomment** method, it instructs the library not to parse
or validate the input in any way, rather assume it to be HTML, and remove all
`<!-- comment -->` entries from it according to the `options`.

## License

Copyright © 2016 [Vitaly Tomilov](https://github.com/vitaly-t);
Released under the MIT license.

[esprima]:https://github.com/jquery/esprima
