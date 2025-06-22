import { useQuery } from "@tanstack/react-query"
import {
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Activity,
  Clock,
  AlertTriangle,
  BarChart3,
  Calendar,
  Star,
  Server,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const fetchDashboardStats = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    totalUsers: 1247,
    totalDocuments: 3456,
    totalConversations: 8923,
    activeUsers: 234,
    totalFeedback: 456,
    totalApiCalls: 12345,
    userGrowth: 12.5,
    documentGrowth: 8.3,
    conversationGrowth: 15.7,
    feedbackGrowth: 10.2,
    apiCallsGrowth: 20.1,
    averageRating: 4.2,
    positiveFeedbackPercentage: 85,
    apiRateLimitUsed: 75,
    systemHealth: 98.5,
  }
}

const fetchRecentActivity = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return [
    {
      id: 1,
      type: "user_signup",
      message: "New user registered: john.doe@example.com",
      timestamp: "2 minutes ago",
      status: "success",
    },
    {
      id: 2,
      type: "document_upload",
      message: "Document uploaded: Advanced React Patterns.pdf",
      timestamp: "5 minutes ago",
      status: "success",
    },
    {
      id: 3,
      type: "system_alert",
      message: "High memory usage detected on server-02",
      timestamp: "12 minutes ago",
      status: "warning",
    },
    {
      id: 4,
      type: "conversation_start",
      message: "New conversation started by user #1234",
      timestamp: "18 minutes ago",
      status: "info",
    },
    {
      id: 5,
      type: "error",
      message: "Failed to process document: corrupted_file.pdf",
      timestamp: "25 minutes ago",
      status: "error",
    },
  ]
}

export default function AdminDashboardPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  })

  const {
    data: activities,
    isLoading: activitiesLoading,
    error: activitiesError,
  } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: fetchRecentActivity,
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_signup":
        return <Users className="w-4 h-4" />
      case "document_upload":
        return <FileText className="w-4 h-4" />
      case "conversation_start":
        return <MessageSquare className="w-4 h-4" />
      case "system_alert":
        return <AlertTriangle className="w-4 h-4" />
      case "error":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400"
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "error":
        return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
    }
  }

  if (statsError || activitiesError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error loading dashboard</h3>
          <p className="text-gray-600 dark:text-gray-400">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Last 30 days</span>
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50 dark:border-blue-800/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Users</CardTitle>
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {statsLoading ? "..." : stats?.totalUsers.toLocaleString()}
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">
                +{statsLoading ? "..." : stats?.userGrowth}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50 dark:border-green-800/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Documents</CardTitle>
              <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">
              {statsLoading ? "..." : stats?.totalDocuments.toLocaleString()}
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">
                +{statsLoading ? "..." : stats?.documentGrowth}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200/50 dark:border-purple-800/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Conversations</CardTitle>
              <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
              {statsLoading ? "..." : stats?.totalConversations.toLocaleString()}
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">
                +{statsLoading ? "..." : stats?.conversationGrowth}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-200/50 dark:border-yellow-800/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Total Feedback</CardTitle>
              <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
              {statsLoading ? "..." : stats?.totalFeedback.toLocaleString()}
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">
                +{statsLoading ? "..." : stats?.feedbackGrowth}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/20 dark:to-teal-950/20 border-cyan-200/50 dark:border-cyan-800/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Total API Calls</CardTitle>
              <Server className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-900 dark:text-cyan-100">
              {statsLoading ? "..." : stats?.totalApiCalls.toLocaleString()}
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">
                +{statsLoading ? "..." : stats?.apiCallsGrowth}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200/50 dark:border-orange-800/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Active Users</CardTitle>
              <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
              {statsLoading ? "..." : stats?.activeUsers.toLocaleString()}
            </div>
            <div className="flex items-center mt-2">
              <Clock className="w-4 h-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Currently online</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest system events and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 animate-pulse">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {activities?.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className={`p-2 rounded-full ${getActivityColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.timestamp}</p>
                    </div>
                    <Badge variant={activity.status === "error" ? "destructive" : "secondary"} className="text-xs">
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feedback Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>Feedback Analytics</span>
            </CardTitle>
            <CardDescription>Overview of user feedback and ratings</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">{stats?.averageRating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">/ 5</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Positive Feedback</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={stats?.positiveFeedbackPercentage} className="w-1/2" />
                    <span>{stats?.positiveFeedbackPercentage}%</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Usage Monitor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="w-5 h-5" />
              <span>API Usage Monitor</span>
            </CardTitle>
            <CardDescription>Current API usage statistics</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rate Limit Usage</p>
                <div className="flex items-center space-x-2">
                  <Progress value={stats?.apiRateLimitUsed} className="w-3/4" />
                  <span>{stats?.apiRateLimitUsed}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}