import { stackServerApp } from "@/stack";

export async function getUserPermission(
  permissionId: string
): Promise<boolean> {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const team = await user.getTeam(process.env.TEAM_ID || '');
  if (team) {
    const permission = await user.getPermission(team, permissionId);
    return !!permission;
  }

  return false;
}
