import { GitExtension } from "../types/git";
import * as vscode from "vscode";

export const getGitExtension = () => {
  const gitExtension =
    vscode.extensions.getExtension<GitExtension>("vscode.git")?.exports;
  return gitExtension?.getAPI(1);
};
