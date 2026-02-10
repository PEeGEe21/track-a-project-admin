"use client";

import { getUsers } from "@/app/actions/users";
import Pagination from "@/components/Pagination";
import showToast from "@/components/ToastComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { Loader, MoreHorizontal, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLES } from "@/lib/constants";
import { formatDateTimeDistance } from "@/lib/utils";
import { User } from "@/types/user";
import Link from "next/link";
import { Download } from "@solar-icons/react";
import { TrashBin2 } from "@solar-icons/react";
import { Checkbox } from "@/components/ui/checkbox";

const statuses = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

// type Organization = {
//   name: string;
//   id: string;
// };

// type UserOrganization = {
//   organization_id: string;
//   user_id: string;
//   id: string;
//   organization: Organization;
// };

export default function Users() {
  const [pageLimit, setPageLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy] = useState<"ASC" | "DESC">("ASC");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // const handlePageChange = (newPage: number) => {
  //   setCurrentPage(newPage);
  // };

  // const fetchUsers = useCallback(
  //   async (page = 1) => {
  //     try {
  //       setLoading(true);
  //       const params = {
  //         limit: pageLimit,
  //         search: searchQuery || undefined,
  //         status: status !== "all" ? status : undefined,
  //         orderBy: orderBy || undefined,
  //       };

  //       const resp = await getUsers(page, params);
  //       if (resp.success) {
  //         const data = resp.data;
  //         setUsers(data?.data);
  //         setMeta(data?.meta);
  //         setCurrentPage(data?.meta?.current_page);
  //       } else {
  //         showToast("error", "Error fetching invites");
  //       }
  //     } catch (err) {
  //       console.error("Error fetching invites:", err?.message);
  //       showToast("error", "Error fetching invites");
  //     } finally {
  //       setTimeout(() => setLoading(false), 500);
  //     }
  //   },
  //   [pageLimit, searchQuery, status]
  // );

  // useEffect(() => {
  //   fetchUsers(1);
  // }, [debouncedSearchQuery, pageLimit, status, orderBy, fetchUsers]);

  // This replaces all your fetchUsers logic!
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "users",
      currentPage,
      pageLimit,
      debouncedSearchQuery,
      status,
      orderBy,
    ],
    queryFn: () =>
      getUsers(currentPage, {
        limit: pageLimit,
        search: debouncedSearchQuery || undefined,
        status: status !== "all" ? status : undefined,
        orderBy: orderBy || undefined,
      }),
    placeholderData: (previousData) => previousData,
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, pageLimit, status, orderBy]);

  // Handle error
  useEffect(() => {
    if (isError) {
      showToast("error", "Error fetching users");
    }
  }, [isError]);

  const users: User[] = data?.success ? data.data.data : [];
  const meta = data?.success ? data.data.meta : null;

  // Bulk operations handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map((org) => org.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return;
    console.log("Deleting users:", selectedUsers);
    showToast("success", `Deleting ${selectedUsers.length} users`);
  };

  const handleBulkExport = () => {
    if (selectedUsers.length === 0) return;
    console.log("Exporting users:", selectedUsers);
    showToast("success", `Exporting ${selectedUsers.length} users`);
  };

  const isAllSelected =
    users.length > 0 && selectedUsers.length === users.length;
  const isSomeSelected =
    selectedUsers.length > 0 && selectedUsers.length < users.length;

  return (
    <>
      <div className="space-y-6">
        <div className="bg-[#171717] border border-[#2B2B2B] rounded-lg shadow text-white">
          <div className="py-4 space-y-4">
            <div className="px-6 ">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-semibold">User Management</h3>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between w-full gap-3 mb-4 px-6 ">
              <div className="flex flex-wrap gap-3">
                <Select
                  value={String(pageLimit)}
                  onValueChange={(value) => setPageLimit(parseInt(value))}
                >
                  <SelectTrigger className="max-w-[100px] border border-[#2B2B2B] bg-[#212121] cursor-pointer shadow-none outline-0 ring-0 focus-visible:outline-none focus-visible:ring-0 focus-within:ring-0 focus:shadow-none focus:ring-0 focus:outline-0 ring-offset-0 focus:ring-offset-0">
                    <SelectValue placeholder="Filter by Limit" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#212121] border-[#2B2B2B] cursor-pointer text-white!">
                    {[5, 10, 15, 20].map((x) => (
                      <SelectItem key={x} value={x.toString()}>
                        {x}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="inline-flex items-center border border-[#2B2B2B] bg-[#212121] rounded-md">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                      }}
                      className="w-64 border border-[#2B2B2B] bg-[#212121] focus:outline-none focus-within:outline-none focus:ring-0 border-none! focus-visible:ring-0 focus:border-none focus-visible:ring-offset-0"
                    />
                    {searchQuery && (
                      <X
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                        size={16}
                        onClick={() => {
                          setSearchQuery("");
                        }}
                      />
                    )}
                  </div>
                  <div className="px-3">
                    <Search
                      className=" text-gray-400 cursor-pointer flex-1"
                      size={20}
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-[120px]">
                  <div>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="border border-[#2B2B2B] bg-[#212121] cursor-pointer shadow-none outline-0 ring-0 focus-visible:outline-none focus-visible:ring-0 focus-within:ring-0 focus:shadow-none focus:ring-0 focus:outline-0 ring-offset-0 focus:ring-offset-0">
                        <SelectValue>
                          {statuses.find((s) => s.value === status)?.label}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-[#212121] border-[#2B2B2B] cursor-pointer text-white!">
                        {/* className="hover:bg-[#2B2B2B]! cursor-pointer hover:text-white!" */}

                        {statuses.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-x-3">
                {selectedUsers.length > 0 ? (
                  <>
                    <Button
                      onClick={handleBulkExport}
                      className="border border-[#2B2B2B] bg-[#212121] hover:bg-[#2B2B2B] cursor-pointer"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export ({selectedUsers.length})
                    </Button>
                    <Button
                      onClick={handleBulkDelete}
                      variant="destructive"
                      className="cursor-pointer"
                    >
                      <TrashBin2 className="h-4 w-4 mr-2" />
                      Delete ({selectedUsers.length})
                    </Button>
                  </>
                ) : (
                  <Button className="border border-[#2B2B2B] bg-[#212121] cursor-pointer shadow-none outline-0 ring-0 focus-visible:outline-none focus-visible:ring-0 focus-within:ring-0 focus:shadow-none focus:ring-0 focus:outline-0 ring-offset-0 focus:ring-offset-0">
                    Export
                  </Button>
                )}

                <Button className="border border-[#2B2B2B] bg-[#ADED221A]! cursor-pointer shadow-none outline-0 ring-0 focus-visible:outline-none focus-visible:ring-0 focus-within:ring-0 focus:shadow-none focus:ring-0 focus:outline-0 ring-offset-0 focus:ring-offset-0">
                  Add User
                </Button>
              </div>
            </div>
          </div>

          <div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className=" text-[#999999]">
                  <TableRow className="bg-[#1F1F1F] hover:bg-[#1F1F1F] uppercase font-medium text-[#999999]! border-b border-[#2B2B2B]">
                    <TableHead className="rounded-tl-lg! w-12 text-[#999999]!">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                        className="border-[#999999]"
                      />
                    </TableHead>
                    <TableHead className="text-[#999999]!">#</TableHead>
                    <TableHead className="text-[#999999]">User</TableHead>
                    <TableHead className="text-[#999999]">Role</TableHead>
                    <TableHead className="text-[#999999]">Status</TableHead>
                    <TableHead className="text-[#999999]">
                      Organizations
                    </TableHead>
                    <TableHead className="text-[#999999]">
                      Joined Date
                    </TableHead>
                    <TableHead className="rounded-tr-lg! text-[#999999]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-[#2B2B2B]">
                  {isLoading ? (
                    <TableRow className="hover:bg-[#212121]">
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-gray-500"
                      >
                        <div className="flex items-center justify-center">
                          <Loader className="animate-spin w-5 h-5" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow className="hover:bg-[#212121]">
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-gray-500"
                      >
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users?.map((user, index) => (
                      <TableRow key={user.id} className="hover:bg-[#212121]">
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={(checked) =>
                              handleSelectUser(user.id, checked as boolean)
                            }
                            aria-label={`Select ${user.fullName}`}
                            className="border-gray-400"
                          />
                        </TableCell>
                        <TableCell>
                          {(currentPage - 1) * meta?.per_page + index + 1}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/users/${user.id}`}
                            className="flex items-center gap-3"
                          >
                            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.avatar}
                            </div>
                            {/* <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                              <Image
                                src={"/images/default.jpg"}
                                alt={`avatar`}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            </div> */}
                            <div className="flex flex-col gap-1">
                              <span className="text-base">{user.fullName}</span>
                              <span>{user?.email}</span>
                            </div>
                          </Link>
                        </TableCell>

                        <TableCell>{user ? ROLES[user.role] : "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full animate-pulse ${
                                user?.is_active ? "bg-green-500" : "bg-red-500"
                              }`}
                            ></div>
                            <span>
                              {user?.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user?.user_organizations?.length ? (
                            user.user_organizations.map((org, index) => (
                              <Link
                                href={`/organizations/${org.organization.id}`}
                                key={org.id}
                              >
                                {org.organization.name}
                                {index < user.user_organizations.length - 1 &&
                                  ", "}
                              </Link>
                            ))
                          ) : (
                            <span className="text-gray-400">
                              No organizations
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDateTimeDistance(user?.created_at)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white"
                            >
                              <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer">
                                Email User
                              </DropdownMenuItem>

                              {user.role !== "super_admin" && (
                                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer text-red-600">
                                  Delete User
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {meta && users?.length > 0 && (
              <Pagination
                meta={meta}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
              />
            )}
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
                        selectedUser.is_active === "Active"
                          ? "bg-green-100 text-green-800"
                          : selectedUser.is_active === "Inactive"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedUser.is_active}
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
