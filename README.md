# reporting-formula-editor

Unofficial support for [Exago](http://www.exagoinc.com) report formulas,
and particularly with PetPoint's Enterprise Reporting built on top of them.

Uses files with the **.rptf** extension.

Neither I nor this extension are affiliated with or supported by Exago, Inc.

## Features

### Syntax highlighting

Understands all the default Exago functions/operators, as well as all the
additional functions provided by PetPoint's implementation.

Also understands `// single-line` and `/* multi-line */` comments - Exago does
not understand these, but the Export to Clipboard feature understands how to
strip them.

### Export to Clipboard

Adds a `Ctrl+P` command for **Export to Clipboard**, which exports the formula
without newlines/whitespace/comments, suitable for pasting directly into a
report cell in Exago.

## Planned/In-Progress Features

### Formatting

Standard **Format Document** support; the reverse of Export to Clipboard

## Requirements

none

## Extension Settings

none

## Known Issues

none

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release, with Syntax Highlighting and Export to Clipboard
