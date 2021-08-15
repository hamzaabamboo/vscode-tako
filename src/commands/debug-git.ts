import { GitExtension } from "../types/git";
import { getGitExtension } from "../utils/getGitExtension";
import * as vscode from "vscode";
import { branchProvider, menuProvider, refreshProviders } from "../providers";

export const debugGit = () => {
  const gitExtension = getGitExtension();
  if (!gitExtension) {
    return vscode.window.showInformationMessage("Oops");
  }
  const api = gitExtension;
  const rootPath = vscode.workspace.workspaceFolders;
  console.log(api.repositories[0].state);
  console.log(api.repositories[0]);
  console.log((api.repositories[0] as any)._repository.pullFrom);
  refreshProviders();
};
