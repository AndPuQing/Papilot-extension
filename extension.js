// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
import got from "got";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("config: ", vscode.workspace.getConfiguration("papilot"));
  console.log('Congratulations, your extension "papilot" is now active!');

  let baseurl = vscode.workspace.getConfiguration("papilot").get("url");
  let maxTokens = vscode.workspace.getConfiguration("papilot").get("maxTokens");
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let code = vscode.languages.registerInlineCompletionItemProvider("python", {
    async provideInlineCompletionItems(document, position, context, token) {
      let text = document.getText(
        new vscode.Range(new vscode.Position(0, 0), position)
      );
      let data = await got
        .post(baseurl + "/v1/engines/codegen/completions", {
          json: {
            prompt: text,
            max_tokens: maxTokens,
            temperature: 0.8,
            top_k: 5,
            top_p: 1.0,
            repetition_penalty: 1.1,
            use_faster: true,
            stream: false,
          },
        })
        .json();
      let choices = JSON.parse(String(data)).choices;
      let items = [];
      for (let choice of choices) {
        let item = new vscode.InlineCompletionItem(choice.text);
        items.push(item);
      }
      return items;
    },
  });

  context.subscriptions.push(code);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
