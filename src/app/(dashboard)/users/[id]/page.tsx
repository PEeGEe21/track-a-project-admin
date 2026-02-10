"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Building2,
  Users,
  FolderKanban,
  Mail,
  Calendar,
  Loader,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Activity,
  Award,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import showToast from "@/components/ToastComponent";
import { ROLES } from "@/lib/constants";
import { UserRole } from "@/types/user";
import { useRouter } from "next/navigation";
import { getUserById } from "@/app/actions/users";

// Types
type User = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  avatar?: string;
  created_at: string;
  updated_at: string;
};

type UserOrganization = {
  id: string;
  role: string;
  joined_at: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    subscription_tier: string;
    is_active: boolean;
  };
};

type UserProject = {
  id: string;
  name: string;
  status: string;
  role: string;
  joined_at: string;
  organization: {
    id: string;
    name: string;
  };
};

type UserActivity = {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  metadata?: any;
};

const getUserOrganizations = async (
  userId: string
): Promise<UserOrganization[]> => {
  // Replace with actual API call
  return [] as UserOrganization[];
};

const getUserProjects = async (userId: string): Promise<UserProject[]> => {
  // Replace with actual API call
  return [] as UserProject[];
};

const getUserActivity = async (userId: string): Promise<UserActivity[]> => {
  // Replace with actual API call
  return [] as UserActivity[];
};

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  // Unwrap params Promise
  const { id } = use(params);

  // Fetch user data
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(parseInt(id)),
  });

  // Fetch user organizations
  const { data: organizations = [] } = useQuery({
    queryKey: ["user-organizations", id],
    queryFn: () => getUserOrganizations(id),
  });

  // Fetch user projects
  const { data: projects = [] } = useQuery({
    queryKey: ["user-projects", id],
    queryFn: () => getUserProjects(id),
  });

  // Fetch user activity
  const { data: activities = [] } = useQuery({
    queryKey: ["user-activity", id],
    queryFn: () => getUserActivity(id),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin w-8 h-8 text-white" />
      </div>
    );
  }

  console.log(user, "user");
  // Calculate stats
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed"
  ).length;
  const totalOrganizations = organizations.length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="border border-[#2B2B2B] bg-[#212121]"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
              {user?.avatar || user?.fullName?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user?.fullName}
              </h1>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-[#2B2B2B] bg-[#212121] text-white"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <Button
            variant="outline"
            className="border-[#2B2B2B] bg-[#212121] text-white"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit User
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#171717] border-[#2B2B2B]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Role</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {user?.role ? ROLES[user.role] : "N/A"}
                </p>
              </div>
              <Award className="h-8 w-8 bg-purple-500 text-white p-1.5 rounded" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#171717] border-[#2B2B2B]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Organizations</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {totalOrganizations}
                </p>
              </div>
              <Building2 className="h-8 w-8 bg-blue-500 text-white p-1.5 rounded" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#171717] border-[#2B2B2B]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Projects</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {activeProjects}
                </p>
              </div>
              <FolderKanban className="h-8 w-8 bg-green-500 text-white p-1.5 rounded" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#171717] border-[#2B2B2B]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      user?.is_active ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-xl font-bold text-white">
                    {user?.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <Activity className="h-8 w-8 bg-orange-500 text-white p-1.5 rounded" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-[#171717] border border-[#2B2B2B]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-[#171717] border-[#2B2B2B]">
              <CardHeader>
                <CardTitle className="text-white">User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400">Full Name</Label>
                    <p className="text-white mt-1">{user?.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Email</Label>
                    <p className="text-white mt-1">{user?.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Role</Label>
                    <p className="text-white mt-1">
                      {user?.role ? ROLES[user.role] : "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Account Status</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          user?.is_active ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <p className="text-white">
                        {user?.is_active ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-400">Joined Date</Label>
                    <p className="text-white mt-1">
                      {user?.created_at &&
                        format(new Date(user.created_at), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Last Updated</Label>
                    <p className="text-white mt-1">
                      {user?.updated_at &&
                        format(new Date(user.updated_at), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#171717] border-[#2B2B2B]">
              <CardHeader>
                <CardTitle className="text-white">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#212121] rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-blue-400" />
                    <span className="text-white">Total Organizations</span>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {totalOrganizations}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#212121] rounded-lg">
                  <div className="flex items-center gap-3">
                    <FolderKanban className="h-5 w-5 text-green-400" />
                    <span className="text-white">Active Projects</span>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {activeProjects}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#212121] rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-400" />
                    <span className="text-white">Completed Projects</span>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {completedProjects}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Organizations Tab */}
        <TabsContent value="organizations" className="space-y-4">
          <Card className="bg-[#171717] border-[#2B2B2B]">
            <CardHeader>
              <CardTitle className="text-white">Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#1F1F1F] hover:bg-[#1F1F1F] border-b border-[#2B2B2B]">
                    <TableHead className="text-[#999999]">
                      Organization
                    </TableHead>
                    <TableHead className="text-[#999999]">Role</TableHead>
                    <TableHead className="text-[#999999]">Tier</TableHead>
                    <TableHead className="text-[#999999]">Status</TableHead>
                    <TableHead className="text-[#999999]">Joined</TableHead>
                    <TableHead className="text-[#999999]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-[#2B2B2B]">
                  {organizations.length === 0 ? (
                    <TableRow className="hover:bg-[#212121]">
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        No organizations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    organizations.map((org) => (
                      <TableRow key={org.id} className="hover:bg-[#212121]">
                        <TableCell>
                          <Link
                            href={`/organizations/${org.organization.id}`}
                            className="text-white hover:text-blue-400"
                          >
                            {org.organization.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-[#2B2B2B]">
                            {org.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-purple-600">
                            {org.organization.subscription_tier}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                org.organization.is_active
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            />
                            <span className="text-white">
                              {org.organization.is_active
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {format(new Date(org.joined_at), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <Card className="bg-[#171717] border-[#2B2B2B]">
            <CardHeader>
              <CardTitle className="text-white">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#1F1F1F] hover:bg-[#1F1F1F] border-b border-[#2B2B2B]">
                    <TableHead className="text-[#999999]">Project</TableHead>
                    <TableHead className="text-[#999999]">
                      Organization
                    </TableHead>
                    <TableHead className="text-[#999999]">Role</TableHead>
                    <TableHead className="text-[#999999]">Status</TableHead>
                    <TableHead className="text-[#999999]">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-[#2B2B2B]">
                  {projects.length === 0 ? (
                    <TableRow className="hover:bg-[#212121]">
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-500"
                      >
                        No projects found
                      </TableCell>
                    </TableRow>
                  ) : (
                    projects.map((project) => (
                      <TableRow key={project.id} className="hover:bg-[#212121]">
                        <TableCell className="text-white">
                          {project.name}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {project.organization.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-[#2B2B2B]">
                            {project.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              project.status === "active"
                                ? "bg-green-600"
                                : project.status === "completed"
                                ? "bg-blue-600"
                                : "bg-gray-600"
                            }
                          >
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {format(new Date(project.joined_at), "MMM dd, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="bg-[#171717] border-[#2B2B2B]">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">
                    No recent activity
                  </p>
                ) : (
                  activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-4 bg-[#212121] rounded-lg"
                    >
                      <div className="mt-1">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {activity.action}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          {activity.description}
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                          {format(
                            new Date(activity.timestamp),
                            "MMM dd, yyyy 'at' h:mm a"
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="bg-[#171717] border-[#2B2B2B]">
            <CardHeader>
              <CardTitle className="text-white">User Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Active Status</Label>
                    <p className="text-sm text-gray-400">
                      Enable or disable user account
                    </p>
                  </div>
                  <Switch checked={user?.is_active} />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Role</Label>
                  <Select defaultValue={user?.role}>
                    <SelectTrigger className="bg-[#212121] border-[#2B2B2B] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#212121] border-[#2B2B2B]">
                      {Object.entries(ROLES).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="pt-4 border-t border-[#2B2B2B] flex justify-between">
                <Button className="bg-green-600 hover:bg-green-700">
                  Save Changes
                </Button>
                <Button variant="destructive">Delete User</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
