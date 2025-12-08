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
