import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	function registerCommand(command: string, callback: (...args: any[]) => any, thisArg?: any) {
		context.subscriptions.push(vscode.commands.registerCommand(command, callback));
	}

	registerCommand("extension.print_asan_info", () => {
		getAsanChannel().append("asan test output");
		getAsanChannel().show();
	});

	registerCommand("extension.print_matching_lines", onCmdPrintMatchingLines);

	registerCommand("extension.delete_matching_lines", () => {});
}

export function deactivate() {}

let _asanInfoChannel: vscode.OutputChannel;
function getAsanChannel(): vscode.OutputChannel {
	if (_asanInfoChannel == null) {
		_asanInfoChannel = vscode.window.createOutputChannel("ASan Info");
	}
	return _asanInfoChannel;
}

let _matchLinesChannel: vscode.OutputChannel;
function getMatchingLinesChannel(): vscode.OutputChannel {
	if (_matchLinesChannel == null) {
		_matchLinesChannel = vscode.window.createOutputChannel("Matching Lines");
	}
	return _matchLinesChannel;
}

function onCmdPrintMatchingLines() {
	// Get regular expression
	vscode.window.showInputBox({
		placeHolder: "Pattern"
	}).then((value) => {
		// Clear screen
		getMatchingLinesChannel().clear();
		if (typeof value === "string") {
			if (vscode.window.activeTextEditor != undefined) {
				let doc = vscode.window.activeTextEditor.document;

				for (let i = 0; i < doc.lineCount; i += 1) {
					let line = doc.lineAt(i).text;

					if (line.match(value)) {
						getMatchingLinesChannel().appendLine(line);
					}
				}
			} else {
				vscode.window.showInformationMessage("Can't find active text editor");
			}
		}
		// Show the result
		getMatchingLinesChannel().show();
	});
}
