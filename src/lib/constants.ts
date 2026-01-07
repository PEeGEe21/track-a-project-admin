import { UserRole } from "@/types/user";

const ROLES: Record<UserRole, string> = {
  super_admin: "Super Admin",
  member: "User",
  org_admin: "Org Admin",
};

export { ROLES };

