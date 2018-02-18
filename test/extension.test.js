/* global suite, test */

//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

const assert = require('assert');
const extension = require('../extension');

suite("sanitizeFormulaForExport tests", function() {
    test("Should not change already-sanitized input", function() {
        let preSanitizedInput = "=CheckContains({Foo.Bar Baz},'qux')";
        assert.equal(preSanitizedInput, extension.sanitizeFormulaForExport(preSanitizedInput));
    });

    test("Should strip newlines", function() {
        assert.equal(
            extension.sanitizeFormulaForExport(`
=CheckContains(
    {Foo.Bar Baz},
    'qux'
 )
`),
        " =CheckContains(     {Foo.Bar Baz},     'qux'  ) ");
    });

    test("Should strip tabs", function() {
        assert.equal(
            extension.sanitizeFormulaForExport(`
=CheckContains(
	{Foo.Bar Baz},
	'qux'
 )
`),
            " =CheckContains(     {Foo.Bar Baz},     'qux'  ) ");
    });

    test("Should strip line comments on their own line", function() {
        assert.equal(
            extension.sanitizeFormulaForExport(`
=CheckContains(
// standalone line comment
    {Foo.Bar Baz},
    'qux'
 )
`),
            " =CheckContains(      {Foo.Bar Baz},     'qux'  ) ");
    });

    test("Should strip line comments at ends of line", function() {
        assert.equal(
            extension.sanitizeFormulaForExport(`
=CheckContains( // ending line comment
    {Foo.Bar Baz},
    'qux' // ending line comment
 )
`),
            " =CheckContains(      {Foo.Bar Baz},     'qux'   ) ");
    });

    test("Should strip block comments", function() {
        assert.equal(
            "=CheckContains({Foo.Bar Baz}, 'qux')",
            extension.sanitizeFormulaForExport(
                "=CheckContains({Foo.Bar Baz},/* block comment */ 'qux')"));
    });

    test("Should strip multiline block comments", function() {
        assert.equal(
            extension.sanitizeFormulaForExport(`
=CheckContains( /*
multiline
block // confusing line comment
comment /* confusing extra opener
  */{Foo.Bar Baz},
    'qux'
 )
`),
            " =CheckContains( {Foo.Bar Baz},     'qux'  ) ");
    });
});