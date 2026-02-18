"use client";

import { getUsers, reActivateUser, suspendUser } from "@/app/actions/users";
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
import {
  AlertTriangle,
  Ban,
  Loader,
  Mail,
  MoreHorizontal,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Eye } from "@solar-icons/react";
import { Badge } from "@/components/ui/badge";
import { Login } from "@solar-icons/react";

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

// ─── Impersonation Confirmation Dialog ───────────────────────────────────────
function CurrentUserDialog({
  user,
  open,
  onClose,
}: {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!user) return null;

  console.log(user, "user");
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
              {user.avatar}
            </div>
            <div>
              {/* <h4 className="text-xl font-semibold">{user?.fullName}</h4> */}
              <h4 className="text-base font-semibold capitalize">
                {user?.username}
              </h4>
              <p className="text-gray-600">{user.email}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                  user.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Role</p>
              <p className="text-lg font-semibold mt-1">{ROLES[user.role]}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-lg font-semibold mt-1">{user.projects}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Tasks Assigned</p>
              <p className="text-lg font-semibold mt-1">{user.tasks}</p>
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
                  Completed &quot;API Integration&quot;
                </span>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm">
                  Updated &quot;User Dashboard&quot;
                </span>
                <span className="text-xs text-gray-500">5 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm">Created new task</span>
                <span className="text-xs text-gray-500">1 day ago</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Mail size={14} className="mr-1" />
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ImpersonateDialog({
  user,
  open,
  onClose,
  onConfirm,
}: {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-500" />
            Sign in as User
          </DialogTitle>
          <DialogDescription>
            You&apos;re about to log in as <strong>{user?.name}</strong>. All
            actions will be logged for audit purposes.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium text-amber-900">⚠️ Important</p>
          <ul className="text-xs text-amber-700 space-y-1 ml-4 list-disc">
            <li>You&apos;ll see exactly what this user sees</li>
            <li>You can perform actions as this user</li>
            <li>A banner will remind you that you&apos;re impersonating</li>
            <li>
              Click &quot;Exit Impersonation&quot; in the banner to return to
              admin
            </li>
            <li>This session is logged and can be audited</li>
          </ul>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">User Details</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-gray-500">Email:</div>
            <div className="font-medium text-gray-900">{user.email}</div>
            <div className="text-gray-500">Organizations:</div>
            <div className="font-medium text-gray-900">
              {user.user_organizations.map((org, index) => (
                <span key={org.id} className="capitalize">
                  {org.organization.name}
                  {index < user.user_organizations.length - 1 && ", "}
                </span>
              ))}
            </div>
            <div className="text-gray-500">Role:</div>
            <div>
              <Badge variant="outline" className="capitalize text-xs">
                {ROLES[user.role]}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Login size={14} className="mr-1.5" />
            Confirm & Sign In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Users() {
  const [pageLimit, setPageLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy] = useState<"ASC" | "DESC">("ASC");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [currentUserOpen, setCurrentUserOpen] = useState(false);
  const [impersonateOpen, setImpersonateOpen] = useState(false);

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
  const { data, isLoading, isError, refetch } = useQuery({
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

  // const handleImpersonate = async () => {
  //   if (!selectedUser) return;

  //   try {
  // Call backend to get impersonation token
  // const { data } = await api.post(
  //   `/admin/users/${selectedUser.id}/impersonate`,
  // );
  // // Store impersonation token and user data
  // setToken(data.token);
  // setUser(data.user);
  // // Store admin context for exit button
  // sessionStorage.setItem("admin_impersonating", "true");
  // sessionStorage.setItem(
  //   "admin_original_token",
  //   localStorage.getItem("token") || "",
  // );
  // setImpersonateOpen(false);
  // Redirect to user's dashboard
  // router.push("/dashboard");
  //   } catch (error: any) {
  //     console.error("Impersonation failed:", error);
  //     alert(error?.response?.data?.message || "Failed to impersonate user");
  //   }
  // };

  const handleSuspendUser = async (userId: number) => {
    if (!confirm("Are you sure you want to suspend this user?")) return;
    try {
      await suspendUser(userId);
      refetch();
    } catch (error) {
      console.error("Failed to suspend user:", error);
    }
  };

  const handleActivateUser = async (userId: number) => {
    if (!confirm("Are you sure you want to activate this user?")) return;
    try {
      await reActivateUser(userId);
      refetch();
    } catch (error) {
      console.error("Failed to suspend user:", error);
    }
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
                                className="capitalize"
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
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 cursor-pointer"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white"
                            >
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setCurrentUserOpen(true);
                                }}
                                className="hover:bg-gray-100 cursor-pointer"
                              >
                                Open Details
                              </DropdownMenuItem>

                              {user.role !== "super_admin" && (
                                <>
                                  <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer text-red-600">
                                    Delete User
                                  </DropdownMenuItem>

                                  {/* <DropdownMen/>enuItem> */}
                                  {user?.is_active ? (
                                    <DropdownMenuItem
                                      className="hover:bg-gray-100 cursor-pointer"
                                      onClick={() => {
                                        handleSuspendUser(user?.id);
                                      }}
                                    >
                                      <Ban size={13} /> Ban
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      className="hover:bg-gray-100 cursor-pointer"
                                      onClick={() => {
                                        handleActivateUser(user?.id);
                                      }}
                                    >
                                      Activate
                                    </DropdownMenuItem>
                                  )}
                                </>
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
      </div>

      <CurrentUserDialog
        user={selectedUser}
        open={currentUserOpen}
        onClose={() => {
          setCurrentUserOpen(false);
          setSelectedUser(null);
        }}
        // onConfirm={handleImpersonate}
      />

      <ImpersonateDialog
        user={selectedUser}
        open={impersonateOpen}
        onClose={() => {
          setImpersonateOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={() => {}}
      />
    </>
  );
}
