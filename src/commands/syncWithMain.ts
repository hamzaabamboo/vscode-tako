import { getVSCodeDownloadUrl } from "vscode-test/out/util";
import { getGitExtension } from "../utils/getGitExtension";
import { storage } from "../utils/storage";
import vscode from "vscode";

export const syncWithMainBranch = async () => {
  const git = getGitExtension();
  const repo = git?.repositories[0];
  const currentBranch = repo?.state.HEAD;
  let mainBranch = storage.get("mainBranch");
  if (!mainBranch) {
    await vscode.commands.executeCommand("vscode-tako.changeMainBranch");
    mainBranch = storage.get("mainBranch");
    if (!mainBranch) {
      vscode.window.showErrorMessage("Please manually set main branch");
      return;
    }
  }
  const [remote, ...branch] = mainBranch.split("/");

  // Refer to https://github.com/microsoft/vscode/blob/main/extensions/git/src/repository.ts for API
  await (repo as any)._repository.pullFrom(false, remote, branch.join("/"));
  vscode.window.showInformationMessage(`Pull ${mainBranch} successful`);
};
