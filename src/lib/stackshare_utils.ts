import { stackServerApp } from "@/stack";

export async function getUserPermission(): Promise<boolean> {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const team = await user.getTeam(process.env.TEAM_ID || '');
  if (team) {
    const permission = await user.getPermission(team, 'member');
    return !!permission;
  }

  return false;
}
