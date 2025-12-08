"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive" | "Pending";
  projects: number;
  tasks: number;
  avatar: string;
};
export default function Users() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const users: User[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      role: "Project Manager",
      status: "Active",
      projects: 12,
      tasks: 48,
      avatar: "SJ",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.c@company.com",
      role: "Developer",
      status: "Active",
      projects: 8,
      tasks: 67,
      avatar: "MC",
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily.d@company.com",
      role: "Designer",
      status: "Active",
      projects: 15,
      tasks: 52,
      avatar: "ED",
    },
    {
      id: 4,
      name: "James Wilson",
      email: "james.w@company.com",
      role: "Developer",
      status: "Inactive",
      projects: 5,
      tasks: 23,
      avatar: "JW",
    },
    {
      id: 5,
      name: "Lisa Anderson",
      email: "lisa.a@company.com",
      role: "Team Lead",
      status: "Active",
      projects: 18,
      tasks: 89,
      avatar: "LA",
    },
    {
      id: 6,
      name: "David Brown",
      email: "david.b@company.com",
      role: "Developer",
      status: "Pending",
      projects: 3,
      tasks: 15,
      avatar: "DB",
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg font-semibold">User Management</h3>
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
                  />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap">
                  Add User
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Projects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tasks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.avatar}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{user.role}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : user.status === "Inactive"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{user.projects}</td>
                    <td className="px-6 py-4 text-sm">{user.tasks}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-semibold">User Profile</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                    {selectedUser.avatar}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">
                      {selectedUser.name}
                    </h4>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                        selectedUser.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : selectedUser.status === "Inactive"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedUser.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="text-lg font-semibold mt-1">
                      {selectedUser.role}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Active Projects</p>
                    <p className="text-lg font-semibold mt-1">
                      {selectedUser.projects}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Tasks Assigned</p>
                    <p className="text-lg font-semibold mt-1">
                      {selectedUser.tasks}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Completion Rate</p>
                    <p className="text-lg font-semibold mt-1">87%</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-3">Recent Activity</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">
                        Completed "API Integration"
                      </span>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">Updated "User Dashboard"</span>
                      <span className="text-xs text-gray-500">5 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">Created new task</span>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    Edit User
                  </button>
                  <button className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
