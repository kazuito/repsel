import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  /* Debug */
  console.log('"Repsel" is now active!');
  // vscode.window.showInformationMessage('"Repsel" is now active!');

  let replaceInSelection = vscode.commands.registerCommand(
    "repsel.replaceInSelection",
    async () => {
      const userConfig = vscode.workspace.getConfiguration("repsel");
      const editor = vscode.window.activeTextEditor;

      if (editor === null || editor === undefined) {
        vscode.window.showErrorMessage("Editor not found - Repsel");
        return;
      }

      let selectionExists: boolean = false;
      for (let i = 0; i < editor.selections.length; i++) {
        let sel = editor.selections[i];
        if (
          sel.start.line !== sel.end.line ||
          sel.start.character !== sel.end.character
        ) {
          selectionExists = true;
          break;
        }
      }
      if (selectionExists === false) {
        vscode.window.showWarningMessage("Selection not found. - Repsel");
        return;
      }

      const queryTarget = await vscode.window.showInputBox({
        placeHolder: "",
        prompt: "Target text",
        value: "",
      });

      const doc = editor.document;
      const targetRegExp = new RegExp(queryTarget ? queryTarget : "", "g");

      console.log(queryTarget);

      if (queryTarget === null || queryTarget === undefined) {
        return;
      } else if (queryTarget === "") {
        vscode.window.showWarningMessage(
          "Enter the target word first - Repsel"
        );
        return;
      }

      /* Highlighting - begin */
      const decorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: userConfig.highlightColor,
      });
      var decorationTargets: vscode.DecorationOptions[] = [];
      var selectedTexts: Array<string> = [];
      var selectedRanges: Array<vscode.Range> = [];

      for (let i = 0; i < editor.selections.length; i++) {
        let selectionRange = new vscode.Range(
          editor.selections[i].start,
          editor.selections[i].end
        );
        selectedRanges.push(selectionRange);

        let selectedText = doc.getText(selectionRange);
        selectedTexts.push(selectedText);

        let matches = selectedText.match(targetRegExp);
        console.log(matches);

        let selectionStartOffset = doc.offsetAt(editor.selections[i].start);

        let searchStartPos = 0;
        if (matches) {
          for (let j = 0; j < matches.length; j++) {
            let searchArea = selectedText.slice(searchStartPos);
            let wordPos = searchArea.search(targetRegExp);
            let word = matches[j];

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
        if (decorationTargets.length === 0) {
          vscode.window.showWarningMessage("Target not found. - Repsel");
          return;
        }
        editor.setDecorations(decorationType, decorationTargets);
      }
      /* Highlighting - end */

      const queryNew = await vscode.window.showInputBox({
        placeHolder: "",
        prompt: "New text",
        value: "",
      });

      decorationType.dispose();

      var replacedTexts: Array<string> = [];

      for (let i = 0; i < editor.selections.length; i++) {
        let replacedText = selectedTexts[i].replace(
          targetRegExp,
          queryNew ? queryNew : queryTarget ? queryTarget : ""
        );
        replacedTexts.push(replacedText);
      }
      await editor.edit(function (editBuilder) {
        for (let i = 0; i < replacedTexts.length; i++) {
          editBuilder.replace(selectedRanges[i], replacedTexts[i]);
        }
      });
    }
  );
  context.subscriptions.push(replaceInSelection);
}

export function deactivate() {}
