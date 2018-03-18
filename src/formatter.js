const vscode = require('vscode');

// Inspired by/parts taken from https://github.com/bradymholt/vscode-pgFormatter/blob/master/src/extension.ts
function fullDocumentRange(document) {
    const lastLineId = document.lineCount - 1;
    return new vscode.Range(
        0,
        0,
        lastLineId,
        document.lineAt(lastLineId).text.length
    );
}

function formatFormula(original, formattingOptions) {
    let indentString = formattingOptions.insertSpaces ? (" " * formattingOptions.tabSize) : "\t";
    
    var result = '';

    var indentLevel = 0;

    var nonWhiteSpaceRegex = /\S/gm;
    var tokenRegex = /|\(|,|\)|\/\*|\/\/|\{|'/gm;
    var tokenMatch;
    var nextUnprocessedIndex = 0;
    while ((tokenMatch = tokenRegex.exec(original)) !== null) {
        switch(tokenMatch[0]) {
            case '(':
                // Keep through the (
                result += original.substring(nextUnprocessedIndex, tokenRegex.lastIndex)
                indentLevel++
                // endLine()
                result += '\n' + (indentString * indentLevel);
                nonWhiteSpaceRegex.lastIndex = tokenRegex.lastIndex;
                nextUnprocessedIndex = original.search(nonWhiteSpaceRegex);
                break;
            case ',':
                // Keep through the ,
                result += original.substring(nextUnprocessedIndex, tokenRegex.lastIndex)
                // endLine()
                result += '\n' + (indentString * indentLevel);
                nonWhiteSpaceRegex.lastIndex = tokenRegex.lastIndex;
                nextUnprocessedIndex = original.search(nonWhiteSpaceRegex);
                break;
            case ')':
                // Keep until before the )
                result += original.substring(nextUnprocessedIndex, tokenRegex.lastIndex - 1)
                indentLevel--
                // endLine()
                result += '\n' + (indentString * indentLevel) + ')';
                nonWhiteSpaceRegex.lastIndex = tokenRegex.lastIndex;
                nextUnprocessedIndex = original.search(nonWhiteSpaceRegex);
                // unless next char is ) or , endLine() again
                if ((original[nextUnprocessedIndex] != ')') && (original[nextUnprocessedIndex] != ',')) {
                    result += '\n' + (indentString * indentLevel);
                }
                break;
            case '/*':
                // Keep through the next */ (across newlines)
                let endBlockComment = original.indexOf('*/', tokenRegex.lastIndex);
                if (endBlockComment === -1) { endBlockComment = original.length - 1; }
                result += original.substring(nextUnprocessedIndex, endBlockComment+1);
                nextUnprocessedIndex = endBlockComment+1;
                break;
            case '//':
                // Keep through the next \n
                let endLineComment = original.indexOf('\n', tokenRegex.lastIndex);
                if (endLineComment === -1) { endLineComment = original.length - 1; }
                result += original.substring(nextUnprocessedIndex, endLineComment+1);
                nextUnprocessedIndex = endLineComment+1;
                break;
            case '{':
                // Keep through the next }
                let endField = original.indexOf('}', tokenRegex.lastIndex);
                if (endField === -1) { endField = original.length - 1; }
                result += original.substring(nextUnprocessedIndex, endField+1);
                nextUnprocessedIndex = endField+1;
                break;
            case '\'':
                // Keep through the next unescaped '
                var endString;
                do {
                    endString = original.indexOf('\'', tokenRegex.lastIndex);
                    if (endString === -1) { endString = original.length - 1}
                } while (original[endString-1] != '\\');
                result += original.substring(nextUnprocessedIndex, endString+1);
                nextUnprocessedIndex = endString+1;
                break;
        }
        if (nextUnprocessedIndex >= original.length || nextUnprocessedIndex == -1) { break; }
        tokenRegex.lastIndex = nextUnprocessedIndex;
    }
    return result;
}

function provideDocumentFormattingEdits(document, formattingOptions) {
    let originalText = document.getText();
    let formattedText = formatFormula(originalText, formattingOptions);
    return [vscode.TextEdit.replace(fullDocumentRange(document), formattedText)];
}

exports.provideDocumentFormattingEdits = provideDocumentFormattingEdits;