import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Menu, CreateMenuDto, UpdateMenuDto, ReorderMenuDto } from "@/types/menu";
import { 
  getGlobalMenus, 
  getMenus, 
  createGlobalMenu,
  updateGlobalMenu,
  deleteGlobalMenu,
  reorderMenus,
} from "@/app/actions/menus";
import { adminQueryKeys } from "@/lib/query-keys";
import { invalidateAdminQueries } from "@/lib/query-utils";

function ensureMenuList(value: unknown): Menu[] {
  return Array.isArray(value) ? (value as Menu[]) : [];
}

export function useMenus() {
  return useQuery({
    queryKey: adminQueryKeys.menus.scoped(),
    queryFn: async () => {
      const result = await getMenus();
      return ensureMenuList(result?.data);
    },
  });
}

// For super admins
export function useGlobalMenus() {
  return useQuery({
    queryKey: adminQueryKeys.menus.global(),
    queryFn: async () => {
      const result = await getGlobalMenus();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch global menus");
      }
      return ensureMenuList(result.data);
    },
  });
}

export function useCreateGlobalMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menu: CreateMenuDto) => {
      const data = await createGlobalMenu(menu);
      return data;
    },
    onSuccess: () => {
      return invalidateAdminQueries(queryClient, [adminQueryKeys.menus.global()]);
    },
  });
}

export function useUpdateGlobalMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateMenuDto;
    }) => {
      const data = await updateGlobalMenu(id, updates);
      return data;
    },
    onSuccess: () => {
      return invalidateAdminQueries(queryClient, [adminQueryKeys.menus.global()]);
    },
  });
}

export function useDeleteGlobalMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteGlobalMenu(id);
    },
    onSuccess: () => {
      return invalidateAdminQueries(queryClient, [adminQueryKeys.menus.global()]);
    },
  });
}

export function useReorderMenus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: ReorderMenuDto[]) => {
      await reorderMenus(items);
    },
    onSuccess: () => {
      return invalidateAdminQueries(queryClient, [adminQueryKeys.menus.global()]);
    },
  });
}
