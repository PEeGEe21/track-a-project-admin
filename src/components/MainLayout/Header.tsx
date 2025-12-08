import { Bell, ChevronDown } from "lucide-react";
import Profile from "../Profile";

export default function Header() {
  return (
    <>
      {/* Header */}
      <header className="bg-[#171717] border-b border-[#2B2B2B] shadow-sm h-[72px]">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold"></h2>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 bg-[#212121] rounded-lg">
              <Bell className="w-5 h-5" color="#fff" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center space-x-3 pl-4">
              <Profile/>
              {/* <ChevronDown className="w-4 h-4 text-gray-400" /> */}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
