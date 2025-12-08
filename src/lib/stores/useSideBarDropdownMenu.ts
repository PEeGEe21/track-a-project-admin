import { create } from "zustand";

interface SidebarMenuState {
  openMenus: Record<string, boolean>;
  toggleMenu: (name: string) => void;
  isOpen: (name: string) => boolean;
  closeAll: () => void;
}

export const useSideBarDropdownMenu = create<SidebarMenuState>((set, get) => ({
  openMenus: {},
  toggleMenu: (name: string) =>
    set((state) => ({
      openMenus: {
        ...state.openMenus,
        [name]: !state.openMenus[name],
      },
    })),
  isOpen: (name: string) => !!get().openMenus[name],
  closeAll: () => set({ openMenus: {} }),
}));
