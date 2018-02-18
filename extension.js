const vscode = require('vscode');

function activate(context) {
    console.log('vscode-reporting-formula-editor is now active!');

    let formatForEdittingDisposable = vscode.commands.registerCommand('extension.formatForEditting', function () {
        vscode.window.showInformationMessage('Hello World (format)!');
    });
    context.subscriptions.push(formatForEdittingDisposable);

    let exportToClipboardDisposable = vscode.commands.registerCommand('extension.exportToClipboard', function () {
        vscode.window.showInformationMessage('Hello World (export)!');
    });
    context.subscriptions.push(exportToClipboardDisposable);
}
exports.activate = activate;

function deactivate() { }
exports.deactivate = deactivate;