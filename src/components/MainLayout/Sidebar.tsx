"use client";

import { menus } from "@/config/modules";
import {
  Menu,
  ChevronDown,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  chevronVariants,
  dropdownVariants,
  itemVariants,
} from "@/utils/animations";
import { iconMap } from "@/lib/icons/icon-map";
import { useSideBarCollapse } from "@/lib/stores/useSideBarCollapse";
import { useSideBarDropdownMenu } from "@/lib/stores/useSideBarDropdownMenu";
import { BoldLogout } from "@/lib/icons/iconJSX";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();
  const { toggleMenu, isOpen } = useSideBarDropdownMenu();
  const { isCollapsed, toggleSidebar } = useSideBarCollapse();

  return (
    <>
      <aside
        className={`bg-gray-900 text-white transition-all duration-300 ${
          !isCollapsed ? "w-64" : "w-20"
        } flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          {!isCollapsed && (
            <h1 className="text-xl font-bold whitespace-nowrap">
              Admin
            </h1>
          )}
          <button
            onClick={() => toggleSidebar()}
            className="p-2 hover:bg-gray-800 rounded"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <ul className="text-neutral-500 text-xs space-y-2">
            {menus.map((module) => {
              const isActive = pathname === module.path;
              const hasChildren = module.children && module.children.length > 0;
              const dropdownOpen = isOpen(module.name);
              const IconComponent = iconMap[module.id as keyof typeof iconMap];

              return (
                <li
                  key={module.name}
                  className="relative bg-vampire-black rounded-xl whitespace-nowrap!"
                >
                  {/* Main menu item */}
                  {module.path ? (
                    <Link
                      href={module.path}
                      className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group h-11 font-semibold whitespace-nowrap! ${
                        isActive
                          ? "bg-[#ADED221A] text-white "
                          : "text-white hover:bg-[#ADED221A] bg-vampire-black"
                      } ${isCollapsed ? "justify-center" : "justify-between"}`}
                      title={!isCollapsed ? module.name : undefined}
                    >
                      <div
                        className={`flex items-center ${
                          isCollapsed ? "" : "space-x-3"
                        }`}
                      >
                        {IconComponent && (
                          <IconComponent
                            className={`w-5 h-5 transition-colors ${
                              isActive
                                ? "text-white"
                                : "text-gray-400 group-hover:text-white"
                            }`}
                          />
                        )}
                        {!isCollapsed && (
                          <span className="text-sm whitespace-nowrap!">
                            {module.name}
                          </span>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <button
                      onClick={() =>
                        hasChildren && !isCollapsed && toggleMenu(module.name)
                      }
                      className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group h-11 font-semibold whitespace-nowrap! ${
                        isActive
                          ? "bg-[#ADED221A] text-white "
                          : "text-white hover:bg-[#ADED221A] bg-vampire-black"
                      } ${isCollapsed ? "justify-center" : "justify-between"}`}
                      title={isCollapsed ? module.name : undefined}
                    >
                      <div
                        className={`flex items-center ${
                          isCollapsed ? "" : "space-x-3"
                        }`}
                      >
                        {IconComponent && (
                          <IconComponent
                            className={`w-5 h-5 transition-colors ${
                              isActive
                                ? "text-white"
                                : "text-gray-400 group-hover:text-white"
                            }`}
                          />
                        )}
                        {!isCollapsed && (
                          <span className="text-sm whitespace-nowrap!">
                            {module.name}
                          </span>
                        )}
                      </div>
                      {hasChildren && !isCollapsed && (
                        <motion.div
                          variants={chevronVariants}
                          animate={dropdownOpen ? "open" : "closed"}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-colors font-medium ${
                              isActive
                                ? "text-white"
                                : "text-gray-400 group-hover:text-white"
                            }`}
                          />
                        </motion.div>
                      )}
                    </button>
                  )}

                  {/* Dropdown menu - only show when not collapsed */}
                  {!isCollapsed && (
                    <AnimatePresence initial={false}>
                      {hasChildren && dropdownOpen && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          transition={{
                            height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                            opacity: {
                              duration: 0.3,
                              delay: 0.1,
                              ease: [0.4, 0, 0.2, 1],
                            },
                          }}
                          className="overflow-hidden"
                        >
                          <div className="my-1 space-y-3 px-3 py-3 bg-vampire-black">
                            {module.children?.map((child, index) => {
                              const IconSubComponent =
                                iconMap[child.id as keyof typeof iconMap];
                              return (
                                <motion.div
                                  key={child.name}
                                  variants={itemVariants}
                                  initial="closed"
                                  animate="open"
                                  exit="closed"
                                  custom={index}
                                >
                                  <Link
                                    href={child.path!}
                                    className={`block w-full text-left p-2 rounded-xl text-sm transition-all duration-200 font-semibold whitespace-nowrap! ${
                                      pathname === child.path
                                        ? "bg-[#ADED221A] text-white font-medium"
                                        : "text-white hover:bg-[#ADED221A] bg-carbon-black"
                                    }`}
                                  >
                                    <div className="flex items-center space-x-3">
                                      {IconSubComponent && (
                                        <IconSubComponent
                                          className={`w-5 h-5 transition-colors ${
                                            isActive
                                              ? "text-white"
                                              : "text-gray-400 group-hover:text-white"
                                          }`}
                                        />
                                      )}
                                      <span className="text-sm whitespace-nowrap!">
                                        {child.name}
                                      </span>
                                    </div>
                                  </Link>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            className={clsx(
              "w-full flex items-center space-x-3 py-3 px-2 rounded-lg hover:bg-gray-800 text-white cursor-pointer",
              isCollapsed ? "justify-center" : ""
            )}
          >
            <BoldLogout className="w-5 h-5" color="#fff" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
