"use client";

import React, { useState } from "react";
import {
  Plus,
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import showToast from "@/components/ToastComponent";
import { ShieldWarning } from "@solar-icons/react";
import {
  MenuForm,
  SortableMenuItem,
} from "@/components/admin/modules/menu-manager-parts";

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
