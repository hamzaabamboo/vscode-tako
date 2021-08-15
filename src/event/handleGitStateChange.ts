import { refreshProviders } from "../providers";
import { getGitExtension } from "../utils/getGitExtension";
import { storage } from "../utils/storage";

export const handleGitStateChange = () => {
  const git = getGitExtension();
  const currentBranch = git?.repositories[0].state.HEAD?.name!;
  let recentBranches = storage.get("recentBranches") ?? [];
  if (currentBranch === recentBranches[0]) return;
  if (recentBranches.includes(currentBranch)) {
    recentBranches = recentBranches.filter((f) => f != currentBranch);
    recentBranches.unshift(currentBranch);
  } else if (recentBranches.length < 5) {
    recentBranches.push(currentBranch);
  } else {
    recentBranches.pop();
    recentBranches.unshift(currentBranch);
  }
  storage.set("recentBranches", recentBranches);
  refreshProviders();
};
