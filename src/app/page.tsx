"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  FolderKanban,
  Activity,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  // Mock data
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12.5%",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active Projects",
      value: "184",
      change: "+8.2%",
      icon: FolderKanban,
      color: "bg-green-500",
    },
    {
      title: "Tasks Completed",
      value: "1,429",
      change: "+23.1%",
      icon: Activity,
      color: "bg-purple-500",
    },
    {
      title: "Revenue",
      value: "$45.2K",
      change: "+15.3%",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  const projectData = [
    { month: "Jan", projects: 45, tasks: 320 },
    { month: "Feb", projects: 52, tasks: 380 },
    { month: "Mar", projects: 61, tasks: 450 },
    { month: "Apr", projects: 58, tasks: 420 },
    { month: "May", projects: 70, tasks: 510 },
    { month: "Jun", projects: 82, tasks: 590 },
  ];

  const userStatusData = [
    { name: "Active", value: 1847, color: "#10b981" },
    { name: "Inactive", value: 624, color: "#ef4444" },
    { name: "Pending", value: 376, color: "#f59e0b" },
  ];

  const users = [
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

  const recentActivity = [
    {
      user: "Sarah Johnson",
      action: "completed project",
      project: "Website Redesign",
      time: "2 hours ago",
    },
    {
      user: "Michael Chen",
      action: "added 5 tasks to",
      project: "Mobile App",
      time: "4 hours ago",
    },
    {
      user: "Emily Davis",
      action: "updated design for",
      project: "Brand Identity",
      time: "6 hours ago",
    },
    {
      user: "Lisa Anderson",
      action: "created new project",
      project: "Q4 Campaign",
      time: "1 day ago",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-sm text-green-600 mt-2">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Project & Task Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="projects"
                stroke="#3b82f6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#10b981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            User Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent ?? 1 * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {userStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-3 pb-4 border-b last:border-b-0"
            >
              <div className="bg-blue-100 rounded-full p-2">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{activity.user}</span>{" "}
                  {activity.action}{" "}
                  <span className="font-semibold">{activity.project}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
