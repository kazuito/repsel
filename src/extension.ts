import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  /* Debug */
  console.log('"Repsel" is now active!');
  vscode.window.showInformationMessage('"Repsel" is now active!');

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

        const doc = editor.document;
        const selectedText = doc.getText(textSelectionRange);
        const targetRegExp = new RegExp(queryTarget ? queryTarget : "", "g");

        /* Highlighting - begin */
        const decorationType = vscode.window.createTextEditorDecorationType({
          backgroundColor: "green",
        });
        var decorationTargets: vscode.DecorationOptions[] = [];
        var matches = selectedText.match(targetRegExp);
        console.log(matches);

        var selectionStartOffset = doc.offsetAt(editor.selection.start);

        var searchStartPos = 0;
        if (matches) {
          for (let i = 0; i < matches.length; i++) {
            let searchArea = selectedText.slice(searchStartPos);
            let wordPos = searchArea.search(targetRegExp);
            let word = matches[i];

            let range = new vscode.Range(
              doc.positionAt(selectionStartOffset + searchStartPos + wordPos),
              doc.positionAt(
                selectionStartOffset + searchStartPos + wordPos + word.length
              )
            );

            searchStartPos += wordPos + word.length;

            decorationTargets.push({
              range,
            });
          }
        }

        editor.setDecorations(decorationType, decorationTargets);
        /* Highlighting - end */

        const queryNew = await vscode.window.showInputBox({
          placeHolder: "",
          prompt: "New text",
          value: "",
        });

        decorationType.dispose();

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
