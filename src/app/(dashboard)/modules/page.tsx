"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Save,
  Loader2,
} from "lucide-react";
import {
  useGlobalMenus,
  useCreateGlobalMenu,
  useUpdateGlobalMenu,
  useDeleteGlobalMenu,
  useReorderMenus,
} from "@/hooks/use-menus";
import { Menu, CreateMenuDto, SubscriptionTier } from "@/types/menu";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import showToast from "@/components/ToastComponent";
import { ShieldWarning } from "@solar-icons/react";

const TIERS: SubscriptionTier[] = [
  "free",
  "basic",
  "professional",
  "enterprise",
];

interface MenuFormProps {
  menu: Menu | null;
  onSave: (menu: CreateMenuDto) => void;
  onCancel: () => void;
  parentOptions: Menu[];
}

const MenuForm: React.FC<MenuFormProps> = ({
  menu,
  onSave,
  onCancel,
  parentOptions,
}) => {
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
        }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          {menu ? "Edit Menu Item" : "Add New Menu Item"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Label *
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Dashboard"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Path (href) *
            </label>
            <input
              type="text"
              value={formData.href}
              onChange={(e) =>
                setFormData({ ...formData, href: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="isActive"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Active
            </label>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface SortableMenuItemProps {
  menu: Menu;
  level: number;
  onEdit: (menu: Menu) => void;
  onDelete: (id: string) => void;
  expandedMenus: Set<string>;
  toggleExpand: (id: string) => void;
}

const SortableMenuItem: React.FC<SortableMenuItemProps> = ({
  menu,
  level,
  onEdit,
  onDelete,
  expandedMenus,
  toggleExpand,
}) => {
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

  const hasChildren = menu.children && menu.children.length > 0;
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
          {menu.children!.map((child) => (
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
};

const SuperAdminMenuManager = () => {
  const { data: menus, isLoading } = useGlobalMenus();
  const createMenu = useCreateGlobalMenu();
  const updateMenu = useUpdateGlobalMenu();
  const deleteMenu = useDeleteGlobalMenu();
  const reorderMenus = useReorderMenus();

  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState(new Set<string>());
  const [menuItems, setMenuItems] = useState<Menu[]>([]);

  React.useEffect(() => {
    if (menus) {
      setMenuItems(menus);
    }
  }, [menus]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleExpand = (menuId: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
  };

  const handleSaveMenu = async (menuData: CreateMenuDto) => {
    try {
      if (editingMenu) {
        await updateMenu.mutateAsync({
          id: editingMenu.id,
          updates: menuData,
        });
        showToast("success", "Menu updated successfully");
      } else {
        await createMenu.mutateAsync(menuData);
        showToast("success", "Menu created successfully");
      }
      setEditingMenu(null);
      setShowAddModal(false);
    } catch (e: unknown) {
      if (e instanceof Error) {
        showToast("error", e.message);
      } else {
        showToast("error", "Failed to save menu!");
      }
    }
  };

  const handleDeleteMenu = async (menuId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this menu item and all its children?"
      )
    ) {
      try {
        await deleteMenu.mutateAsync(menuId);
        showToast("success", "Menu deleted successfully");
      } catch (e: unknown) {
        if (e instanceof Error) {
          showToast("error", e.message);
        } else {
          showToast("error", "Failed to delete menu!");
        }
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = menuItems.findIndex((item) => item.id === active.id);
    const newIndex = menuItems.findIndex((item) => item.id === over.id);

    const newMenus = arrayMove(menuItems, oldIndex, newIndex);
    setMenuItems(newMenus);

    // Prepare reorder data
    const reorderData = newMenus.map((menu, index) => ({
      menuId: menu.id,
      newOrderIndex: index,
      parentId: menu.parent_id || null,
    }));

    try {
      await reorderMenus.mutateAsync(reorderData);
      console.log("donee");
      showToast("success", "Menus reordered successfully");
    } catch (error) {
      showToast("error", "Failed to reorder menus");
      // Revert on error
      setMenuItems(menus || []);
    }
  };

  const topLevelMenus = menuItems?.filter((m) => !m.parent_id) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 bg-[#171717] rounded-lg p-4 border border-[#2B2B2B]">
        <div className="font-semibold text-[#999999] mb-2 inline-flex items-center gap-2">
          <ShieldWarning weight="Bold" size={24} />
          <span>How it works:</span>
        </div>
        <ul className="text-sm text-[#999999] space-y-1">
          <li>• Menus configured here are available to ALL organizations</li>
          <li>• Organizations only see menus their subscription tier allows</li>
          <li>• Organization admins can enable/disable menus for their org</li>
          <li>• Drag menu items to reorder them</li>
        </ul>
      </div>

      <div className="bg-[#171717] border border-[#2B2B2B] rounded-lg shadow text-white">
        <div className="border-b border-[#2B2B2B] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Menu Management</h2>
              <p className="text-[#999999] mt-1">
                Configure menus available to all organizations based on their
                subscription tier
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Menu
            </button>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={topLevelMenus.map((m) => m.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="divide-y divide-[#2B2B2B]">
              {topLevelMenus.map((menu) => (
                <SortableMenuItem
                  key={menu.id}
                  menu={menu}
                  level={0}
                  onEdit={setEditingMenu}
                  onDelete={handleDeleteMenu}
                  expandedMenus={expandedMenus}
                  toggleExpand={toggleExpand}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {topLevelMenus.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No menus configured yet. Click "Add Menu" to get started.
          </div>
        )}
      </div>

      {(editingMenu || showAddModal) && (
        <MenuForm
          menu={editingMenu}
          onSave={handleSaveMenu}
          onCancel={() => {
            setEditingMenu(null);
            setShowAddModal(false);
          }}
          parentOptions={topLevelMenus}
        />
      )}
    </div>
  );
};

export default SuperAdminMenuManager;
