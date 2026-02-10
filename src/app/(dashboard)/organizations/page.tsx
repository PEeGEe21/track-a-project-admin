"use client";

import Pagination from "@/components/Pagination";
import showToast from "@/components/ToastComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { getOrganizations } from "@/app/actions/organizations";
import { format } from "date-fns";
import Link from "next/link";
import { Download } from "@solar-icons/react";
import { TrashBin2 } from "@solar-icons/react";

const statuses = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

type Organization = {
  name: string;
  max_users: number;
  userCount: number;
  created_at: string;
  user_organizations: {
    user: {
      fullName: string;
    };
  }[];
  email?: string;
  max_projects: number;
  is_active: boolean;
  id: string;
};

export default function page() {
  const [pageLimit, setPageLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy] = useState<"ASC" | "DESC">("ASC");
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "organizations",
      currentPage,
      pageLimit,
      debouncedSearchQuery,
      status,
      orderBy,
    ],
    queryFn: () =>
      getOrganizations(currentPage, {
        limit: pageLimit,
        search: debouncedSearchQuery || undefined,
        status: status !== "all" ? status : undefined,
        orderBy: orderBy || undefined,
      }),
    placeholderData: (previousData) => previousData, // Keep old data while fetching
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
      showToast("error", "Error fetching orgaizations");
    }
  }, [isError]);

  const organizations: Organization[] = data?.success ? data.data.data : [];
  const meta = data?.success ? data.data.meta : null;

  // Bulk operations handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrgs(organizations.map((org) => org.id));
    } else {
      setSelectedOrgs([]);
    }
  };

  const handleSelectOrg = (orgId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrgs([...selectedOrgs, orgId]);
    } else {
      setSelectedOrgs(selectedOrgs.filter((id) => id !== orgId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedOrgs.length === 0) return;
    console.log("Deleting organizations:", selectedOrgs);
    showToast("success", `Deleting ${selectedOrgs.length} organizations`);
  };

  const handleBulkExport = () => {
    if (selectedOrgs.length === 0) return;
    console.log("Exporting organizations:", selectedOrgs);
    showToast("success", `Exporting ${selectedOrgs.length} organizations`);
  };

  const isAllSelected =
    organizations.length > 0 && selectedOrgs.length === organizations.length;
  const isSomeSelected =
    selectedOrgs.length > 0 && selectedOrgs.length < organizations.length;

  return (
    <>
      <div className="space-y-6">
        <div className="bg-[#171717] border border-[#2B2B2B] rounded-lg shadow text-white">
          <div className="py-4 space-y-4">
            <div className="px-6 ">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-semibold">
                  Organization Management
                </h3>
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
                      placeholder="Search organizations..."
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
                {selectedOrgs.length > 0 ? (
                  <>
                    <Button
                      onClick={handleBulkExport}
                      className="border border-[#2B2B2B] bg-[#212121] hover:bg-[#2B2B2B] cursor-pointer"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export ({selectedOrgs.length})
                    </Button>
                    <Button
                      onClick={handleBulkDelete}
                      variant="destructive"
                      className="cursor-pointer"
                    >
                      <TrashBin2 className="h-4 w-4 mr-2" />
                      Delete ({selectedOrgs.length})
                    </Button>
                  </>
                ) : (
                  <Button className="border border-[#2B2B2B] bg-[#212121] cursor-pointer shadow-none outline-0 ring-0 focus-visible:outline-none focus-visible:ring-0 focus-within:ring-0 focus:shadow-none focus:ring-0 focus:outline-0 ring-offset-0 focus:ring-offset-0">
                    Export
                  </Button>
                )}
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
                    <TableHead className=" text-[#999999]!">#</TableHead>
                    <TableHead className="text-[#999999]">Name</TableHead>
                    <TableHead className="text-[#999999]">Admin</TableHead>
                    <TableHead className="text-[#999999]">Status</TableHead>
                    <TableHead className="text-[#999999]">
                      No of Users
                    </TableHead>
                    <TableHead className="text-[#999999]">
                      Max Projects
                    </TableHead>
                    <TableHead className="text-[#999999]">
                      Created Date
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
                        colSpan={9}
                        className="text-center py-8 text-gray-500"
                      >
                        <div className="flex items-center justify-center">
                          <Loader className="animate-spin w-5 h-5" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : organizations.length === 0 ? (
                    <TableRow className="hover:bg-[#212121]">
                      <TableCell
                        colSpan={9}
                        className="text-center py-8 text-gray-500"
                      >
                        No organizations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    organizations?.map((org, index) => (
                      <TableRow key={org.id} className="hover:bg-[#212121]">
                        <TableCell>
                          <Checkbox
                            checked={selectedOrgs.includes(org.id)}
                            onCheckedChange={(checked) =>
                              handleSelectOrg(org.id, checked as boolean)
                            }
                            aria-label={`Select ${org.name}`}
                            className="border-gray-400"
                          />
                        </TableCell>
                        <TableCell>
                          {(currentPage - 1) * meta?.per_page + index + 1}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`organizations/${org.id}`}
                            className="flex items-center gap-3"
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-base">{org.name}</span>
                              <span>{org?.email}</span>
                            </div>
                          </Link>
                        </TableCell>

                        <TableCell>
                          {org.user_organizations?.[0]
                            ? org.user_organizations[0].user?.fullName
                            : "No admin"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full animate-pulse ${
                                org?.is_active ? "bg-green-500" : "bg-red-500"
                              }`}
                            ></div>
                            <span>
                              {org?.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-400">
                            {org?.userCount || 0} / {org?.max_users}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-400">
                            {org?.max_projects}
                          </span>
                        </TableCell>
                        <TableCell>
                          {/* {formatDateTimeDistance(org?.created_at)} */}
                          {format(new Date(org?.created_at), "MMM dd, yyyy")}
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
                              <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer text-red-600">
                                Delete Organization
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {meta && organizations?.length > 0 && (
              <Pagination
                meta={meta}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
