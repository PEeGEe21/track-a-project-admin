import {
  FileText,
  FolderOpen,
  LayoutDashboard,
  Settings,
  UserCog,
  Workflow,
} from "lucide-react";
import { BoldLogout, BoldUser, BoldWallet2 } from "./iconJSX";
import { Banknote } from "@solar-icons/react";
import { Banknote2 } from "@solar-icons/react";
import { Tag } from "@solar-icons/react";
import { Buildings2 } from "@solar-icons/react";
import { Home } from "@solar-icons/react";

export const iconMap = {
  dashboard: Home,
  users: UserCog,
  projects: FolderOpen,
  reports: FileText,
  settings: Settings,
  logout: BoldLogout,
  cashier: BoldWallet2,
  profile: BoldUser,
  subscriptions: Banknote2,
  plans: Tag,
  modules: Workflow,
  organizations: Buildings2,
};
