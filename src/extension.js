const vscode = require('vscode');
const clipboardy = require('clipboardy');
const formatter = require('./formatter');

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
    let formattingProviderDisposable = vscode.languages.registerDocumentFormattingEditProvider(
        { language: 'reportingformula' },
        formatter);
    context.subscriptions.push(formattingProviderDisposable);

    let exportToClipboardDisposable = vscode.commands.registerCommand('extension.exportToClipboard', function () {
        let originalContent = getTextToExport();
        let sanitizedContent = sanitizeFormulaForExport(originalContent);
        clipboardy.writeSync(sanitizedContent);
        
        vscode.window.setStatusBarMessage('Exported formula to clipboard (without comments/newlines)', 5000);
    });
    context.subscriptions.push(exportToClipboardDisposable);
}
exports.activate = activate;

function deactivate() { }
exports.deactivate = deactivate;