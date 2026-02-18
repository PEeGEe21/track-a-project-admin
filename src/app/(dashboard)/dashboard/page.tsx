"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  FolderKanban,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Database,
  Clock,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { getDashboardData } from "@/app/actions/dashboard";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DashboardStats {
  organizations: { total: number; active: number; growth: number };
  users: { total: number; active: number; growth: number };
  projects: { total: number; active: number };
  revenue: { mrr: number; arr: number; growth: number };
  storage: { used: number; total: number; percentage: number };
  performance: { uptime: number; avgResponseTime: number; errorRate: number };
}

interface ChartData {
  growthChart: Array<{ date: string; organizations: number; users: number }>;
  revenueChart: Array<{ month: string; revenue: number; churn: number }>;
  planDistribution: Array<{ name: string; value: number; color: string }>;
}

// ─── Stat Card Component ──────────────────────────────────────────────────────
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = "indigo",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  trend?: "up" | "down";
  trendValue?: string;
  color?: string;
}) {
  const colors = {
    indigo: "bg-indigo-100 text-indigo-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
    violet: "bg-violet-100 text-violet-600",
  };

  return (
    <Card className="bg-[#171717] border border-[#2B2B2B] gap-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[#999999]">
          {title}
        </CardTitle>
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            colors[color as keyof typeof colors],
          )}
        >
          <Icon size={20} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white">{value}</div>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        {trend && trendValue && (
          <div className="flex items-center gap-1 mt-2">
            {trend === "up" ? (
              <ArrowUpRight size={14} className="text-green-600" />
            ) : (
              <ArrowDownRight size={14} className="text-red-600" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                trend === "up" ? "text-green-600" : "text-red-600",
              )}
            >
              {trendValue}
            </span>
            <span className="text-xs text-gray-400">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [charts, setCharts] = useState<ChartData | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await getDashboardData();
      // console.log(response, "datadatadata")
      setStats(response?.data?.stats);
      setCharts(response?.data?.charts);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats || !charts) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchDashboardData}>
            <RefreshCw size={14} className="mr-1.5" />
            Refresh
          </Button>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <Activity size={12} className="mr-1" />
            System Healthy
          </Badge>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Organizations"
          value={stats.organizations.total.toLocaleString()}
          subtitle={`${stats.organizations.active} active`}
          icon={Building2}
          trend={stats.organizations.growth > 0 ? "up" : "down"}
          trendValue={`${Math.abs(stats.organizations.growth)}%`}
          color="indigo"
        />
        <StatCard
          title="Total Users"
          value={stats.users.total.toLocaleString()}
          subtitle={`${stats.users.active} active today`}
          icon={Users}
          trend={stats.users.growth > 0 ? "up" : "down"}
          trendValue={`${Math.abs(stats.users.growth)}%`}
          color="blue"
        />
        <StatCard
          title="MRR"
          value={`$${(stats.revenue.mrr / 1000).toFixed(1)}k`}
          subtitle={`ARR: $${(stats.revenue.arr / 1000).toFixed(0)}k`}
          icon={DollarSign}
          trend={stats.revenue.growth > 0 ? "up" : "down"}
          trendValue={`${Math.abs(stats.revenue.growth)}%`}
          color="green"
        />
        <StatCard
          title="Storage Used"
          value={`${stats.storage.percentage}%`}
          subtitle={`${stats.storage.used} GB / ${stats.storage.total} GB`}
          icon={Database}
          color="amber"
        />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList className="bg-white border">
          <TabsTrigger
            value="growth"
            className=" data-[state=active]:bg-gray-200 data-[state=active]:text-[#2B2B2B] cursor-pointer"
          >
            Growth Trends
          </TabsTrigger>
          <TabsTrigger
            value="revenue"
            className=" data-[state=active]:bg-gray-200 data-[state=active]:text-[#2B2B2B] cursor-pointer"
          >
            Revenue
          </TabsTrigger>
          <TabsTrigger
            value="plans"
            className=" data-[state=active]:bg-gray-200 data-[state=active]:text-[#2B2B2B] cursor-pointer"
          >
            Plan Distribution
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className=" data-[state=active]:bg-gray-200 data-[state=active]:text-[#2B2B2B] cursor-pointer"
          >
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Over Time</CardTitle>
              <CardDescription>
                Organizations and Users growth (last 30 days)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={charts.growthChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="organizations"
                    stroke="#6366f1"
                    strokeWidth={2}
                    name="Organizations"
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Churn</CardTitle>
              <CardDescription>
                Monthly recurring revenue and churn rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={charts.revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    fill="#10b981"
                    name="Revenue ($)"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="churn"
                    fill="#ef4444"
                    name="Churn ($)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>
                Distribution of organizations by plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={charts.planDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {charts.planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">System Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">
                  {stats.performance.uptime}%
                </div>
                <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Avg Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600">
                  {stats.performance.avgResponseTime}ms
                </div>
                <p className="text-xs text-gray-500 mt-2">API endpoints</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Error Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-amber-600">
                  {stats.performance.errorRate}%
                </div>
                <p className="text-xs text-gray-500 mt-2">Last 24 hours</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common admin tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
            >
              <Building2 size={20} />
              <span className="text-xs">Organizations</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
            >
              <Users size={20} />
              <span className="text-xs">Users</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
            >
              <DollarSign size={20} />
              <span className="text-xs">Subscriptions</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
            >
              <Zap size={20} />
              <span className="text-xs">Feature Flags</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
