// src/types/module.d.ts
export interface Module {
  id: string;
  name: string;
  path?: string;
  icon?: string;
  action?: string;
  permissions?: string[];
  children?: Module[];
}

export enum SubscriptionTier {
  FREE = "free",
  STARTER = "starter",
  PROFESSIONAL = "professional",
  ENTERPRISE = "enterprise",
}

export interface Menu {
  id: string;
  label: string;
  href: string;
  icon?: string;
  parent_id?: string;
  order_index: number;
  required_tier: SubscriptionTier;
  is_active: boolean;
  children?: Menu[];
}
