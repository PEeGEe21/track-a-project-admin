import { UserProps } from "@/types/user";

export function formatNameCode(name: string | undefined) {
  return name ? name[0].toUpperCase() : "";
}

export function getFullName(user: UserProps) {
  const name = `${user?.first_name}` + " " + `${user?.last_name}`;
  return name;
}
