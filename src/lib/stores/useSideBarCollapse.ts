import { create } from "zustand";

type SideBarCollapseStore = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setIsCollapsed: (collapsed: boolean) => void;
  openSidebar: () => void;
  closeSidebar: () => void;
};
export const useSideBarCollapse = create<SideBarCollapseStore>((set) => ({
  isCollapsed: false,
  toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setIsCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
  openSidebar: () => set({ isCollapsed: true }),
  closeSidebar: () => set({ isCollapsed: false }),
}));
