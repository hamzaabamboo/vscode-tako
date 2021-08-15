import { EventEmitter } from "stream";
import vscode, { TreeDataProvider, TreeItem, TreeItemLabel } from "vscode";
import { API, Branch } from "../types/git";
import { getGitExtension } from "../utils/getGitExtension";
import { storage } from "../utils/storage";

export class BranchItem extends TreeItem {
  constructor(
    public readonly label: string | TreeItemLabel,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command,
    public readonly branch?: Branch
  ) {
    super(label);
  }
}
export class TakoBranchProvider implements TreeDataProvider<BranchItem> {
  private git?: API = getGitExtension();

  _onDidChangeTreeData: vscode.EventEmitter<null> =
    new vscode.EventEmitter<null>();
  onDidChangeTreeData: vscode.Event<null> = this._onDidChangeTreeData.event;

  constructor() {}

  refresh() {
    this._onDidChangeTreeData.fire(null);
  }

  getTreeItem(item: BranchItem) {
    return item;
  }
  async getChildren(item: BranchItem) {
    const currentBranch = this.git?.repositories[0].state.HEAD;
    if (!item || !item?.branch?.name) {
      const refs = await this.git?.repositories[0].getBranches({});
      const recentBranches = storage.get("recentBranches");
      const branches = recentBranches
        ? recentBranches.map((r) => refs?.find((b) => b.name === r)!)
        : refs!;

      return (
        branches.map(
          (r) =>
            new BranchItem(
              r === currentBranch
                ? {
                    label: r?.name ?? "",
                    highlights: [[0, r?.name?.length ?? 0]],
                  }
                : r?.name ?? "",
              r === currentBranch ? 2 : 1,
              {
                command: "vscode-tako.checkout",
                tooltip: "Checkout",
                title: "Checkout",
                arguments: [r],
              },
              r
            )
        ) ?? []
      );
    }

    const branch = await this.git?.repositories[0].getBranch(item.branch.name);
    const mainBranch = storage.get("mainBranch");

    return [
      ...(currentBranch?.name === branch?.name
        ? [
            new BranchItem(
              {
                label: `Sync with ${mainBranch || "Main Branch"}`,
              },
              0,
              {
                command: "vscode-tako.syncWithMainBranch",
                tooltip: "Sync With Main Branch",
                title: "Sync With Main Branch",
              }
            ),
            ...(branch?.ahead !== 0 || branch?.behind !== 0
              ? [
                  new BranchItem(
                    {
                      label: "Pull",
                    },
                    0,
                    {
                      command: "git.pull",
                      tooltip: "pull",
                      title: "Pull",
                    }
                  ),
                ]
              : []),
          ]
        : [
            new BranchItem(
              {
                label: "Checkout",
              },
              0,
              {
                command: "vscode-tako.checkout",
                tooltip: "Checkout",
                title: "Checkout",
                arguments: [branch],
              }
            ),
          ]),
    ];
  }
}
