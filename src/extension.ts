// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { changeMainBranch } from "./commands/changeMainBranch";
import { checkout } from "./commands/checkout";
import { debugGit } from "./commands/debug-git";
import { helloWorld } from "./commands/hello-world";
import { syncWithMainBranch } from "./commands/syncWithMain";
import { handleGitStateChange } from "./event/handleGitStateChange";
import { branchProvider, menuProvider } from "./providers";
import { API } from "./types/git";
import { getGitExtension } from "./utils/getGitExtension";
import { storage } from "./utils/storage";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  const gitApi = getGitExtension();
  if (!gitApi) {
    vscode.window.showErrorMessage("Oops git not available Imma commit sudoku");
    return;
  }

  storage.init(context);

  initCommands(context);
  initViewDataProvider(context);
  initGitListeners(context, gitApi);
}

const initCommands = (ctx: vscode.ExtensionContext) => {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  console.log("Registering Commands...");
  ctx.subscriptions.push(
    vscode.commands.registerCommand("vscode-tako.helloWorld", helloWorld),
    vscode.commands.registerCommand("vscode-tako.debugGit", debugGit),
    vscode.commands.registerCommand("vscode-tako.checkout", checkout),
    vscode.commands.registerCommand(
      "vscode-tako.changeMainBranch",
      changeMainBranch
    ),
    vscode.commands.registerCommand(
      "vscode-tako.syncWithMainBranch",
      syncWithMainBranch
    )
  );
  console.log("Commands Successfully Registered !");
};

const initGitListeners = (ctx: vscode.ExtensionContext, git: API) => {
  ctx.subscriptions.push(
    git.repositories[0].state.onDidChange(handleGitStateChange)
  );
};

const initViewDataProvider = (ctx: vscode.ExtensionContext) => {
  vscode.window.registerTreeDataProvider("tako-branch", branchProvider);
  vscode.window.registerTreeDataProvider("tako-menu", menuProvider);
};
// this method is called when your extension is deactivated
export function deactivate() {}
