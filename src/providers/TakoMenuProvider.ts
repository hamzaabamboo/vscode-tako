import vscode, { TreeDataProvider, TreeItem, TreeItemLabel } from "vscode";
import { storage } from "../utils/storage";

export class MenuItem implements TreeItem {
  constructor(
    public readonly label: string | TreeItemLabel,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {}
}

export class TakoMenuProvider implements TreeDataProvider<MenuItem> {
  _onDidChangeTreeData: vscode.EventEmitter<null> =
    new vscode.EventEmitter<null>();
  onDidChangeTreeData: vscode.Event<null> = this._onDidChangeTreeData.event;

  constructor() {}

  refresh() {
    this._onDidChangeTreeData.fire(null);
  }

  getTreeItem(item: MenuItem) {
    return item;
  }

  async getChildren(item: MenuItem) {
    const mainBranch = storage.get("mainBranch");
    return [
      new MenuItem(
        {
          label: "Custom Debug Function",
        },
        0,
        {
          command: "vscode-tako.debugGit",
          tooltip: "Debug",
          title: "Debug Git",
        }
      ),
      new MenuItem(
        {
          label: mainBranch
            ? `Main Branch: ${mainBranch}`
            : "Select Main Branch",
        },
        0,
        {
          command: "vscode-tako.changeMainBranch",
          tooltip: "Debug",
          title: "Change Main Branch",
        }
      ),
    ];
  }
}
