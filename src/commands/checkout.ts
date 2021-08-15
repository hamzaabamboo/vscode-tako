import { getGitExtension } from "../utils/getGitExtension";
import * as vscode from "vscode";
import { Branch } from "../types/git";
import { branchProvider } from "../providers";

export const checkout = async (branch: Branch) => {
  const git = getGitExtension();
  if (!git || !branch.name) return;
  const repo = git?.repositories[0];
  try {
    if (repo.state.workingTreeChanges.length > 0) {
      const currentbranch = repo.state.HEAD;
      await (repo as any)._repository.createStash(
        `Tako Stash on branch ${currentbranch?.name}`,
        true
      );
    }
    await repo.checkout(branch.name);
    const stashes = await (repo as any)._repository.getStashes();
    const s = stashes.find((s: { description: string; index: number }) =>
      s.description.includes(`Tako Stash on branch ${branch.name}`)
    );
    if (s) {
      await (repo as any)._repository.popStash(s.index);
    }

    branchProvider.refresh();
  } catch {
    vscode.window.showErrorMessage("Checkout Failed");
  }
};
