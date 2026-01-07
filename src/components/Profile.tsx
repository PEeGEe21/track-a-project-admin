import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProfileMenu } from "../config/modules";
import showToast from "./ToastComponent";
import { useUserStore } from "@/lib/stores/useUserStore";
import { formatNameCode } from "@/utils/format";
import { iconMap } from "@/lib/icons/icon-map";
import { ROLES } from "@/lib/constants";
import { logoutUser } from "@/app/actions/auth";

const Profile = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const { setLoading, logout } = useUserStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = (menu: string) => {
    switch (menu) {
      case "logout":
        handleLogout();
        break;
      case "profile":
        setIsDropdownOpen(false);
        break;
      default:
        return;
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setIsDropdownOpen(false);
    const response = await logoutUser();
    if (response?.success) {
      showToast("success", `Successfully logged out`);
      router.push("/");
      logout();
    } else {
      showToast("error", "Failed to log out");
    }
    setLoading(false);
  };

  const handleLinkClick = () => {
    setIsDropdownOpen(false);
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <div
            className={`hidden rounded-xl lg:flex relative cursor-pointer items-center justify-center gap-2`}
          >
            <div className={`flex relative items-center justify-center`}>
              {user?.avatar ? (
                <div className="w-10 h-10 relative object-contain">
                  <Image
                    src="/default.png"
                    fill
                    alt="tasty coin"
                    priority
                    className="block h-full w-full rounded-full object-contain"
                  />
                </div>
              ) : (
                <div className="bg-[#ADED221A] w-10 h-10 whitespace-nowrap flex items-center justify-center rounded-full">
                  <span className="whitespace-nowrap ">
                    {formatNameCode(user?.first_name)}
                    {formatNameCode(user?.last_name)}
                  </span>
                </div>
              )}
            </div>
            <div className="hidden sm:block">
              <p className="font-semibold text-sm text-white">
                {user?.first_name}
              </p>
              <p className="text-xs text-[#999999]">
                {user ? ROLES[user.role] : "-"}
              </p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={10}
          className="max-w-[250px] w-[250px] bg-[#171717] border-[0.5px] border-[#2B2B2B] font-fig-tree rounded-[15px] hidden lg:block !p-0 shadow-[#1F1F1F96]"
        >
          <div className="p-4 space-y-[11px]">
            <DropdownMenuLabel className="!p-0">
              <h2 className="text-sm font-medium text-white">Account</h2>
            </DropdownMenuLabel>
            <div className="space-y-2">
              {ProfileMenu.map((menu, index) => {
                const IconComponent = iconMap[menu.id as keyof typeof iconMap];
                return (
                  <div key={menu.id} className="w-full block">
                    {menu.path ? (
                      <Link
                        key={index}
                        href={menu.path || "#"}
                        onClick={handleLinkClick}
                        className={`flex items-center justify-between p-3 bg-[#2B2B2B] border border-[#0A0A0A] hover:border-[#2B2B2B] hover:bg-[#212121] rounded-xl h-11 w-full transition duration-300`}
                      >
                        <div className="flex items-center gap-3">
                          {IconComponent && (
                            <IconComponent
                              className={`w-5 h-5 transition-colors text-white`}
                            />
                          )}
                          <span className="font-medium text-white text-sm">
                            {menu.name}
                          </span>
                        </div>
                      </Link>
                    ) : (
                      <button
                        onClick={() => toggleMenu(menu?.action ?? "")}
                        className={`flex items-center justify-between p-3 bg-[#2B2B2B] border border-[#0A0A0A] hover:border-[#2B2B2B] hover:bg-[#212121] rounded-xl h-11 w-full transition duration-300 cursor-pointer`}
                      >
                        <div className="flex items-center gap-3">
                          {IconComponent && (
                            <IconComponent
                              className={`w-5 h-5 transition-colors text-white`}
                            />
                          )}
                          <span className="font-medium text-white text-sm">
                            {menu.name}
                          </span>
                        </div>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Profile;
