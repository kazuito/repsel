import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  /* Debug */
  // console.log('"Repsel" is now active!');
  // vscode.window.showInformationMessage('"Repsel" is now active!');

  let replaceInSelection = vscode.commands.registerCommand(
    "repsel.replaceInSelection",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (
        editor &&
        editor.selection.start.character === editor.selection.end.character &&
        editor.selection.start.line === editor.selection.end.line
      ) {
        vscode.window.showWarningMessage("Selection not found. - Repsel");
      } else if (editor) {
        const textSelectionRange = new vscode.Range(
          editor.selection.start,
          editor.selection.end
        );

        const queryTarget = await vscode.window.showInputBox({
          placeHolder: "",
          prompt: "Target text",
          value: "",
        });
        const queryNew = await vscode.window.showInputBox({
          placeHolder: "",
          prompt: "New text",
          value: "",
        });

        const document = editor.document;
        const selectedText = document.getText(textSelectionRange);

        const targetRegExp = new RegExp(queryTarget ? queryTarget : "", "g");

        const replacedText = selectedText.replace(
          targetRegExp,
          queryNew ? queryNew : ""
        );

        editor.edit(function (editBuilder) {
          editBuilder.replace(textSelectionRange, replacedText);
        });
      }
    }
  );

  context.subscriptions.push(replaceInSelection);
}

export function deactivate() {}
