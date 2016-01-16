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

For build systems / task runners see [gulp-decomment] and [grunt-decomment].

## Features

* Removes both single and multi-line comments from JSON, JavaScript and CSS/Text
* Automatically recognizes HTML and removes all `<!-- comments -->` from it
* Does not change layout / formatting of the original document
* Removes lines that have only comments on them
* Compatible with CSS3, JSON5 and ECMAScript 6

The library does not support mixed content - HTML with JavaScript or CSS in it.
Once the input code is recognized as HTML, only the HTML comments will be removed from it.

## Performance

For JSON and JavaScript this library uses [esprima] to guarantee correct processing for regular expressions.

As an example, it can process [AngularJS 1.5 Core](https://code.angularjs.org/1.5.0-rc.0/angular.js)
in under 100ms, which is 1.1MB ~ 30,000 lines of JavaScript.   

## API

### decomment(code, [options]) ⇒ String

This method first checks if the code starts with `<`, as an HTML, and if so,
all `<!-- comment -->` entries are removed, according to the `options`.

When the `code` is not recognized as HTML, it is assumed to be either JSON or JavaScript.
It is then parsed through [esprima] for ECMAScript 6 compliance, and to extract details
about regular expressions.

If [esprima] fails to validate the code, it will throw a parsing error. When successful,
this method will remove `//` and `/**/` comments according to the `options` (see below).

##### options.safe ⇒ Boolean | RegExp

* `false (default)` - remove all multi-line comments
* `true` - keep multi-line comments that start with `/*!`
* `RegExp` - provide a matcher for custom safe comment format (example to keep JSDoc use: `/^\/\*\* /`)

Example:

```js
var decomment = require('decomment');
var code = "/*! special */ var a; /* normal */";
decomment(code); //=> var a;
decomment(code, {safe: true}); //=> /*! special */ var a;
```

NOTE: This option has no effect when processing HTML.

##### options.space ⇒ Boolean

* `false (default)` - remove comment blocks entirely
* `true` - replace comment blocks with white spaces where needed, in order to preserve
the original line + column position of every code element.

Example:
 
```js
var decomment = require('decomment');
var code = "var a/*text*/, b"; 
decomment(code); //=> var a, b
decomment(code, {space: true}); //=> var a        , b
```

NOTE: When this option is enabled, option `trim` is ignored.

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

NOTE: This option has no effect when option `space` is enabled.

##### options.platform ⇒ String

Overrides the environment platform settings.

By default, this library processes line breaks according to the environment OS,
which this option overrides, according to the value specified:

* `auto` - determine the platform automatically from the text
* `unix` - force Unix notation for the line breaks
* `windows` - force Windows notation for the line breaks 

When `auto` is specified, `text` is scanned to determine the platform
according to the frequency of the line break notations used in it. 
When it is impossible to determine automatically, the library defaults
back to the environment-based settings.

### decomment.text(text, [options]) ⇒ String

Unlike the default **decomment**, it instructs the library that `text` is not a JSON,
JavaScript or HTML, rather a plain text that needs no parsing or validation,
only to remove `//` and `/**/` comments from it according to the `options`.

This method is good for any text file that uses syntax `//` and `/**/` for comments,
such as: `.CSS`, `.CPP`, `.H`, etc.

Example:

```js
var decomment = require('decomment');
var text = ".my-class{color:Red;}// comments";
decomment.text(text); //=> .my-class{color:Red;}
```

Please note that while the same rules apply for the text blocks (`''`, `""` and \`\`),
you should not use this method for JSON or JavaScript, as it can break your regular expressions.

### decomment.html(html, [options]) ⇒ String

Unlike the default **decomment** method, it instructs the library not to parse
or validate the input in any way, rather assume it to be HTML, and remove all
`<!-- comment -->` entries from it according to the `options`.

## License

Copyright © 2016 [Vitaly Tomilov](https://github.com/vitaly-t);
Released under the MIT license.

[esprima]:https://github.com/jquery/esprima
[grunt-decomment]:https://github.com/vitaly-t/grunt-decomment
[gulp-decomment]:https://github.com/vitaly-t/gulp-decomment
