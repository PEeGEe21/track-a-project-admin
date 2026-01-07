import { UserProps } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AccountPreferences {
  currency: string;
  language: string;
  isDisplayName: boolean;
}

interface AccountConnections {
  hide_game_data: boolean;
  hide_my_username: boolean;
  max_profit_alert: boolean;
}

interface EmailNotifications {
  deposit_email: boolean;
  withdrawal_email: boolean;
  marketing_promotion: boolean;
}

export interface UserPreferences {
  account_preferences?: AccountPreferences;
  account_connections?: AccountConnections;
  email_notifications?: EmailNotifications;
}

type User = UserProps & {
  preferences?: UserPreferences;
};

type UserStore = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (section: keyof UserPreferences, data: any) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: true,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          loading: false,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      updatePreferences: (section, data) =>
        set((state) => {
          if (!state.user) return { user: null };

          return {
            user: {
              ...state.user,
              preferences: {
                ...state.user.preferences,
                [section]: data,
              },
            },
          };
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
        }),

      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "user-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
