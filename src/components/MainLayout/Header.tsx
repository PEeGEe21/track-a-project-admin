import { Bell, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold"></h2>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center space-x-3 pl-4 border-l">
              <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                AD
              </div>
              <div className="hidden sm:block">
                <p className="font-semibold text-sm">Admin User</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
