import { Branch } from "../types/git";
import vscode from "vscode";
import { getGitExtension } from "../utils/getGitExtension";
import { storage } from "../utils/storage";
import { menuProvider, refreshProviders } from "../providers";

export const changeMainBranch = async (branch?: Branch) => {
  let selectedBranch = branch;
  const gitAPI = getGitExtension();
  if (!selectedBranch) {
    const remotes = gitAPI?.repositories[0].state.remotes;
    if (!remotes) return;
    const selectedRemote = await vscode.window.showQuickPick(
      remotes.map((r) => r.name)
    );
    try {
      if (!selectedRemote) throw new Error();
      const branches = await gitAPI?.repositories[0].state.refs.filter(
        (r) => r.remote === selectedRemote
      );
      if (!branches) throw new Error();
      const selectedBranch = await vscode.window.showQuickPick(
        branches.map((r) => r.name!)
      );
      if (!selectedBranch) throw new Error();
      storage.set("mainBranch", selectedBranch);
    } catch {
      storage.set("mainBranch", undefined);
    }
    refreshProviders();
  }
};
