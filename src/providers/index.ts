import { TakoBranchProvider } from "./TakoBranchesProvider";
import { TakoMenuProvider } from "./TakoMenuProvider";

export const branchProvider = new TakoBranchProvider();
export const menuProvider = new TakoMenuProvider();

export const refreshProviders = () => {
  branchProvider.refresh();
  menuProvider.refresh();
};
