export interface UserProps {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  avatar?: string;
  fullName?: string;
  created_at: string;
  role: UserRole;
  is_active: "Active" | "Inactive";
  sUsername?: string;
  phone?: string;
  phone_code?: string;
  id: string;
  _id: string;
}

export interface UserAvatar {
  id?: string;
  svg?: string;
  text?: string;
}

export interface ChatTokenProps {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
}

export type UserRole = "super_admin" | "member" | "org_admin";

export type User = {
  id: number;
  name?: string;
  email: string;
  fullName: string;
  created_at: string;
  role: UserRole;
  is_active: "Active" | "Inactive";
  projects: number;
  tasks: number;
  user_organizations: UserOrganization[];
  avatar: string;
};
