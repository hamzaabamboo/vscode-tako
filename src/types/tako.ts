import { TextDocument } from "vscode";

export interface TakoState {
  mainBranch: string;
  recentBranches: string[];
}
