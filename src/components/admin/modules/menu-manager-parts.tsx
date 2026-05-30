"use client";

import { Menu, CreateMenuDto, SubscriptionTier } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Edit2, GripVertical, Save, Trash2 } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { useState } from "react";
import showToast from "@/components/ToastComponent";

const TIERS: SubscriptionTier[] = [
  "free",
  "basic",
  "professional",
  "enterprise",
];

export function MenuForm({
  menu,
  onSave,
  onCancel,
  parentOptions,
}: {
  menu: Menu | null;
  onSave: (menu: CreateMenuDto) => void;
  onCancel: () => void;
  parentOptions: Menu[];
}) {
  const [formData, setFormData] = useState<CreateMenuDto>(
    menu
      ? {
          label: menu.label,
          href: menu.href,
          icon: menu.icon || "",
          required_tier: menu.required_tier,
          is_active: menu.is_active,
          parent_id: menu.parent_id || null,
          order_index: menu.order_index,
        }
      : {
          label: "",
          href: "",
          icon: "",
          required_tier: "free",
          is_active: true,
          parent_id: null,
        },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.href) {
      showToast("error", "Label and href are required");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          {menu ? "Edit Menu Item" : "Add New Menu Item"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Label
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              placeholder="Dashboard"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Path (href)
            </label>
            <input
              type="text"
              value={formData.href}
              onChange={(e) =>
                setFormData({ ...formData, href: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              placeholder="/dashboard"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Icon
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              placeholder="LayoutDashboard"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Required Tier
            </label>
            <select
              value={formData.required_tier}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  required_tier: e.target.value as SubscriptionTier,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
            >
              {TIERS.map((tier) => (
                <option key={tier} value={tier}>
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Parent Menu (Optional)
            </label>
            <select
              value={formData.parent_id || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  parent_id: e.target.value || null,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
            >
              <option value="">None (Top Level)</option>
              {parentOptions.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex gap-2 mt-6">
            <Button type="submit" className="flex-1 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SortableMenuItem({
  menu,
  level,
  onEdit,
  onDelete,
  expandedMenus,
  toggleExpand,
}: {
  menu: Menu;
  level: number;
  onEdit: (menu: Menu) => void;
  onDelete: (id: string) => void;
  expandedMenus: Set<string>;
  toggleExpand: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: menu.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasChildren = Boolean(menu.children?.length);
  const isExpanded = expandedMenus.has(menu.id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border-b border-[#2B2B2B] last:border-b-0"
    >
      <div
        className="flex items-center gap-3 p-3 hover:bg-[#212121]"
        style={{ paddingLeft: `${level * 24 + 12}px` }}
      >
        <div {...attributes} {...listeners} className="cursor-move">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>

        {hasChildren && (
          <button onClick={() => toggleExpand(menu.id)} className="p-1">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{menu.label}</span>
            <span className="text-xs text-[#999999]">{menu.href}</span>
            {!menu.is_active && (
              <span className="text-xs bg-[#212121] px-2 py-0.5 rounded">
                Inactive
              </span>
            )}
          </div>
          <div className="text-xs text-[#999999] mt-0.5">
            Required: {menu.required_tier}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(menu)}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(menu.id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {menu.children?.map((child) => (
            <SortableMenuItem
              key={child.id}
              menu={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              expandedMenus={expandedMenus}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}
