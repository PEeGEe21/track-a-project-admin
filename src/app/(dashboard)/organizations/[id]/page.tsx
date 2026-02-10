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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Building2,
  Users,
  FolderKanban,
  Crown,
  Calendar,
  Loader,
  Edit,
  Trash2,
  UserPlus,
  Menu,
  Lock,
} from "lucide-react";
import Link from "next/link";
import showToast from "@/components/ToastComponent";
import {
  getOrganization,
  getOrganizationMenus,
  getOrganizationTeam,
} from "@/app/actions/organizations";
import { ROLES } from "@/lib/constants";
import { UserProps, UserRole } from "@/types/user";
import { useRouter } from "next/navigation";

// Types
type Organization = {
  id: string;
  name: string;
  slug: string;
  subscription_tier: string;
  max_users: number;
  max_projects: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  userCount: number;
  projectCount: number;
};

type TeamMember = {
  id: string;
  user: UserProps;
  role?: UserRole;
  created_at: string;
};

type OrganizationMenu = {
  id: string;
  organization_id: string;
  global_menu_id: string;
  is_enabled: boolean;
  custom_label: string | null;
  order_index: number;
  has_tier_access: boolean;
  requires_upgrade: boolean;
  required_tier: string;
  is_available: boolean;
  global_menu: {
    id: string;
    label: string;
    href: string;
    icon: string | null;
    required_tier: string;
    is_active: boolean;
  };
};

export default function OrganizationDetailPage({
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

  // Fetch organization data
  const { data: organization, isLoading } = useQuery({
    queryKey: ["organization", id],
    queryFn: () => getOrganization(id),
  });

  // Fetch team members
  const { data: teamMembers = [] } = useQuery({
    queryKey: ["organization-team", id],
    queryFn: () => getOrganizationTeam(id),
    enabled: !!id,
  });

  // Fetch organization menus
  const { data: menus = [] } = useQuery({
    queryKey: ["organization-menus", id],
    queryFn: () => getOrganizationMenus(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin w-8 h-8 text-white" />
      </div>
    );
  }

  const subscriptionTiers = [
    { value: "free", label: "Free", color: "bg-gray-500" },
    { value: "basic", label: "Basic", color: "bg-blue-500" },
    { value: "professional", label: "Pro", color: "bg-purple-500" },
    { value: "enterprise", label: "Enterprise", color: "bg-yellow-500" },
  ];

  const currentTier = subscriptionTiers.find(
    (t) => t.value === organization?.subscription_tier
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="border border-[#2B2B2B] bg-[#212121] cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-white">
              {organization?.name}
            </h1>
            <p className="text-sm text-gray-400">@{organization?.slug}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-[#2B2B2B] bg-[#212121] text-white"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Organization
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#171717] border-[#2B2B2B]">
          <CardContent className="h-full flex items-center w-full">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm text-gray-400">Subscription</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {currentTier?.label}
                </p>
              </div>
              <Crown
                className={`h-8 w-8 ${currentTier?.color} text-white p-1.5 rounded`}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#171717] border-[#2B2B2B]">
          <CardContent className="h-full flex items-center w-full">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm text-gray-400">Team Members</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {organization?.userCount || 0}/{organization?.max_users}
                </p>
              </div>
              <Users className="h-8 w-8 bg-green-500 text-white p-1.5 rounded" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#171717] border-[#2B2B2B]">
          <CardContent className="h-full flex items-center w-full">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm text-gray-400">Projects</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {organization?.projectCount || 0}/{organization?.max_projects}
                </p>
              </div>
              <FolderKanban className="h-8 w-8 bg-blue-500 text-white p-1.5 rounded" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#171717] border-[#2B2B2B]">
          <CardContent className="h-full flex items-center w-full">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      organization?.is_active ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-xl font-bold text-white">
                    {organization?.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <Building2 className="h-8 w-8 bg-orange-500 text-white p-1.5 rounded" />
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
        <TabsList className="bg-[#171717] border border-[#2B2B2B] text-white">
          <TabsTrigger
            value="overview"
            className="text-white data-[state=active]:text-[#2B2B2B]"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="subscription"
            className="text-white data-[state=active]:text-[#2B2B2B]"
          >
            Subscription
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="text-white data-[state=active]:text-[#2B2B2B]"
          >
            Team
          </TabsTrigger>
          <TabsTrigger
            value="menus"
            className="text-white data-[state=active]:text-[#2B2B2B]"
          >
            Menus
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="text-white data-[state=active]:text-[#2B2B2B]"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="bg-[#171717] border-[#2B2B2B]">
            <CardHeader>
              <CardTitle className="text-white">
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Organization Name</Label>
                  <p className="text-white mt-1">{organization?.name}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Slug</Label>
                  <p className="text-white mt-1">@{organization?.slug}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Created Date</Label>
                  <p className="text-white mt-1">
                    {organization?.created_at &&
                      format(
                        new Date(organization?.created_at),
                        "MMM dd, yyyy"
                      )}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400">Last Updated</Label>
                  <p className="text-white mt-1">
                    {organization?.updated_at &&
                      format(
                        new Date(organization?.updated_at),
                        "MMM dd, yyyy"
                      )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-4">
          <Card className="bg-[#171717] border-[#2B2B2B]">
            <CardHeader>
              <CardTitle className="text-white">Subscription Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-400">Current Plan</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`${currentTier?.color} text-white`}>
                      {currentTier?.label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-400">User Limit</Label>
                  <p className="text-white mt-1">
                    {organization?.userCount || 0} / {organization?.max_users}{" "}
                    users
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400">Project Limit</Label>
                  <p className="text-white mt-1">
                    {organization?.projectCount || 0} /{" "}
                    {organization?.max_projects} projects
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-[#2B2B2B]">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Upgrade Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card className="bg-[#171717] border-[#2B2B2B]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Team Members</CardTitle>
                <Button className="bg-green-600 hover:bg-green-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#1F1F1F] hover:bg-[#1F1F1F] border-b border-[#2B2B2B]">
                    <TableHead className="text-[#999999]">Member</TableHead>
                    <TableHead className="text-[#999999]">Email</TableHead>
                    <TableHead className="text-[#999999]">Role</TableHead>
                    <TableHead className="text-[#999999]">Joined</TableHead>
                    <TableHead className="text-[#999999]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-[#2B2B2B]">
                  {teamMembers.length === 0 ? (
                    <TableRow className="hover:bg-[#212121]">
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-500"
                      >
                        No team members found
                      </TableCell>
                    </TableRow>
                  ) : (
                    teamMembers.map((member: TeamMember) => (
                      <TableRow key={member.id} className="hover:bg-[#212121]">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {member?.user?.fullName &&
                                  member?.user?.fullName.charAt(0)}
                              </span>
                            </div>
                            <span className="text-white">
                              {member?.user.fullName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {member?.user.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-[#2B2B2B] text-muted-foreground"
                          >
                            {member && member.role ? ROLES[member?.role] : "-"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {member?.created_at
                            ? format(
                                new Date(member?.created_at),
                                "MMM dd, yyyy"
                              )
                            : "-"}
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

        {/* Menus Tab */}
        <TabsContent value="menus" className="space-y-4">
          <Card className="bg-[#171717] border-[#2B2B2B]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Organization Menus</CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Menu className="h-4 w-4 mr-2" />
                  Configure Menus
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#1F1F1F] hover:bg-[#1F1F1F] border-b border-[#2B2B2B]">
                    <TableHead className="text-[#999999]">Name</TableHead>
                    <TableHead className="text-[#999999]">Path</TableHead>
                    <TableHead className="text-[#999999]">Icon</TableHead>
                    <TableHead className="text-[#999999]">Order</TableHead>
                    <TableHead className="text-[#999999]">
                      Required Tier
                    </TableHead>
                    <TableHead className="text-[#999999]">Status</TableHead>
                    <TableHead className="text-[#999999]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-[#2B2B2B]">
                  {menus.length === 0 ? (
                    <TableRow className="hover:bg-[#212121]">
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-gray-500"
                      >
                        No menus configured
                      </TableCell>
                    </TableRow>
                  ) : (
                    menus.map((menu: OrganizationMenu) => (
                      <TableRow
                        key={menu.id}
                        className={`hover:bg-[#212121] ${
                          !menu.has_tier_access ? "opacity-60" : ""
                        }`}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {!menu?.has_tier_access && (
                              <Lock className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className="text-white">
                              {menu?.custom_label || menu?.global_menu?.label}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {menu?.global_menu?.href}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {menu?.global_menu?.icon || "N/A"}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {menu?.order_index}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              menu?.requires_upgrade
                                ? "border-yellow-500 text-yellow-500"
                                : "border-green-500 text-green-500"
                            }`}
                          >
                            {menu?.global_menu?.required_tier}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {menu?.requires_upgrade ? (
                            <Badge
                              variant="outline"
                              className="border-yellow-500 text-yellow-500"
                            >
                              Locked
                            </Badge>
                          ) : (
                            <Switch
                              checked={menu?.is_enabled}
                              disabled={!menu?.has_tier_access}
                              className="
                                    data-[state=checked]:bg-green-500
                                    data-[state=unchecked]:bg-red-500
                                "
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {menu?.requires_upgrade ? (
                            <Button
                              size="sm"
                              className="bg-yellow-600 hover:bg-yellow-700"
                            >
                              Upgrade
                            </Button>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-blue-500 hover:text-blue-600"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="bg-[#171717] border-[#2B2B2B]">
            <CardHeader>
              <CardTitle className="text-white">
                Organization Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Active Status</Label>
                    <p className="text-sm text-gray-400">
                      Enable or disable the organization
                    </p>
                  </div>
                  <Switch
                    checked={organization?.is_active}
                    onCheckedChange={(value) => {
                      console.log("New value:", value);
                    }}
                    className="
                                    data-[state=checked]:bg-green-500
                                    data-[state=unchecked]:bg-red-500
                                "
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Max Users</Label>
                  <Input
                    type="number"
                    defaultValue={organization?.max_users}
                    className="bg-[#212121] border-[#2B2B2B] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Max Projects</Label>
                  <Input
                    type="number"
                    defaultValue={organization?.max_projects}
                    className="bg-[#212121] border-[#2B2B2B] text-white"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-[#2B2B2B] flex justify-between">
                <Button className="bg-green-600 hover:bg-green-700">
                  Save Changes
                </Button>
                <Button variant="destructive">Delete Organization</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
