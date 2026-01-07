import {
  FileText,
  FolderOpen,
  LayoutDashboard,
  Settings,
  UserCog,
  Workflow,
} from "lucide-react";
import { BoldLogout, BoldUser, BoldWallet2 } from "./iconJSX";

export const iconMap = {
  dashboard: LayoutDashboard,
  users: UserCog,
  projects: FolderOpen,
  reports: FileText,
  settings: Settings,
  logout: BoldLogout,
  cashier: BoldWallet2,
  profile: BoldUser,
  modules: Workflow,
  organizations: Workflow,
};
