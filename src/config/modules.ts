import { Module } from "@/types/module";

export const menus: Module[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    path: "/",
  },
  {
    id: "users",
    name: "Users",
    path: "/users",
  },
  {
    id: "projects",
    name: "Projects",
    path: "/projects",
  },
  {
    id: "reports",
    name: "Reports",
    children: [
      {
        id: "analytics",
        name: "General Analytics",
        path: "/reports/analytics",
      },
      {
        id: "users_reports",
        name: "User Reports",
        path: "/reports/users-reports",
      },
      {
        id: "project_reports",
        name: "Projects Reports",
        path: "/reports/project-reports",
      },
      {
        id: "chat_reports",
        name: "Chat Reports",
        path: "/reports/chat-reports",
      },
    ],
  },
  {
    id: "settings",
    name: "Settings",
    path: "/settings",
  },
];
