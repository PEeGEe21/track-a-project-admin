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

export function useMenus() {
  return useQuery({
    queryKey: ["menus"],
    queryFn: async () => {
      const { data } = await getMenus();
      console.log(data, "datadatadata");
      return data as Menu[];
    },
  });
}

// For super admins
export function useGlobalMenus() {
  return useQuery({
    queryKey: ["global-menus"],
    queryFn: async () => {
      const { data } = await getGlobalMenus();

      console.log(data, 'data')
      return data as Menu[];
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
      queryClient.invalidateQueries({ queryKey: ["global-menus"] });
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
      queryClient.invalidateQueries({ queryKey: ["global-menus"] });
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
      queryClient.invalidateQueries({ queryKey: ["global-menus"] });
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
      queryClient.invalidateQueries({ queryKey: ["global-menus"] });
    },
  });
}
