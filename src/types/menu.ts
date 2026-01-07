// types/menu.ts

export type SubscriptionTier = "free" | "basic" | "professional" | "enterprise";

export interface Menu {
  id: string;
  label: string;
  href: string;
  icon?: string;
  required_tier: SubscriptionTier;
  is_active: boolean;
  parent_id?: string | null;
  order_index: number;
  children?: Menu[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateMenuDto {
  label: string;
  href: string;
  icon?: string;
  required_tier: SubscriptionTier;
  is_active: boolean;
  parent_id?: string | null;
  order_index?: number;
}

export interface UpdateMenuDto {
  label?: string;
  href?: string;
  icon?: string;
  required_tier?: SubscriptionTier;
  is_active?: boolean;
  parent_id?: string | null;
  order_index?: number;
}

export interface ReorderMenuDto {
  menuId: string;
  newOrderIndex: number;
  parentId?: string | null;
}