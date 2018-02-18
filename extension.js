const vscode = require('vscode');
const clipboardy = require('clipboardy');

function getTextToExport() {
    // Might be nice for this to pull just the selected text if some is selected
    return vscode.window.activeTextEditor.document.getText();
}

function sanitizeFormulaForExport(rawContent) {
    return rawContent
        .replace(/\/\*[\s\S]*\*\//gm, "") // Block (/* */) comments
        .replace(/\/\/.*/g, "") // Line (//) comments
        .replace(/\t/g, "    ") // strip tabs
        .replace(/\r?\n/g, " "); // strip newlines
}
exports.sanitizeFormulaForExport = sanitizeFormulaForExport;

function activate(context) {
    let formatForEdittingDisposable = vscode.commands.registerCommand('extension.formatForEditting', function () {
        vscode.window.showErrorMessage('Not implemented yet!');
    });
    context.subscriptions.push(formatForEdittingDisposable);

    let exportToClipboardDisposable = vscode.commands.registerCommand('extension.exportToClipboard', function () {
        let originalContent = getTextToExport();
        let sanitizedContent = sanitizeFormulaForExport(originalContent);
        clipboardy.writeSync(sanitizedContent);
        vscode.window.showInformationMessage('Exported formula to clipboard (without comments/newlines)');
    });
    context.subscriptions.push(exportToClipboardDisposable);
}
exports.activate = activate;

function deactivate() { }
exports.deactivate = deactivate;