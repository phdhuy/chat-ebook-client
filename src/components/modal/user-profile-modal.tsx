import type React from "react";
import { useState } from "react";
import {
  Bell,
  Clock,
  CreditCard,
  ExternalLink,
  LogOut,
  MessageSquare,
  Settings,
  User,
  BarChart3,
  Brain,
  FileText,
  Upload,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useApiUsage } from "@/hooks/use-api-usage";

interface ApiUsageData {
  count: number;
  resource_type: string;
}

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile?: {
    username: string;
    email?: string;
    avatar_url?: string;
  };
  onSignOut?: () => void;
}

export default function UserProfileModal({
  open,
  onOpenChange,
  profile,
  onSignOut,
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const { data: apiUsageResponse, isLoading, error } = useApiUsage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] p-0 gap-0 border-none shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950 rounded-2xl overflow-hidden">
        <DialogHeader className="p-8 border-b border-gray-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Account Settings
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-[600px]">
          <div className="w-[240px] border-r border-gray-200/50 dark:border-zinc-800/50 bg-gradient-to-b from-gray-50/80 to-white/80 dark:from-zinc-900/80 dark:to-zinc-950/80 backdrop-blur-sm">
            <nav className="flex flex-col p-4 space-y-2">
              <NavItem
                icon={<User size={20} />}
                label="My Profile"
                active={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
              />
              <NavItem
                icon={<BarChart3 size={20} />}
                label="API Usage"
                active={activeTab === "usage"}
                onClick={() => setActiveTab("usage")}
              />
              <NavItem
                icon={<Settings size={20} />}
                label="Preferences"
                active={activeTab === "preference"}
                onClick={() => setActiveTab("preference")}
              />
              <NavItem
                icon={<MessageSquare size={20} />}
                label="Response Model"
                active={activeTab === "model"}
                onClick={() => setActiveTab("model")}
              />
              <NavItem
                icon={<CreditCard size={20} />}
                label="Subscription"
                active={activeTab === "subscription"}
                onClick={() => setActiveTab("subscription")}
              />
              <NavItem
                icon={<Clock size={20} />}
                label="Billing History"
                active={activeTab === "billing"}
                onClick={() => setActiveTab("billing")}
              />
              <NavItem
                icon={<Bell size={20} />}
                label="Guide"
                active={activeTab === "guide"}
                onClick={() => setActiveTab("guide")}
                hasExternalLink
              />
            </nav>
            <div className="absolute bottom-0 left-0 w-[240px] p-4 border-t border-gray-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
              <NavItem
                icon={<LogOut size={20} />}
                label="Sign Out"
                onClick={() => {
                  if (onSignOut) {
                    onSignOut();
                    onOpenChange(false);
                  }
                }}
                variant="danger"
              />
            </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto bg-white/30 dark:bg-zinc-950/30">
            {activeTab === "profile" && <ProfileContent profile={profile} />}
            {activeTab === "usage" &&
              (isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 dark:text-red-400">
                  Error loading API usage: {error.message}
                </div>
              ) : (
                <UsageContent apiUsage={apiUsageResponse?.data || []} />
              ))}
            {activeTab === "preference" && (
              <div className="text-gray-600 dark:text-gray-400">
                Preference settings coming soon...
              </div>
            )}
            {activeTab === "model" && (
              <div className="text-gray-600 dark:text-gray-400">
                Response model settings coming soon...
              </div>
            )}
            {activeTab === "subscription" && (
              <div className="text-gray-600 dark:text-gray-400">
                Subscription settings coming soon...
              </div>
            )}
            {activeTab === "billing" && (
              <div className="text-gray-600 dark:text-gray-400">
                Billing history coming soon...
              </div>
            )}
            {activeTab === "guide" && (
              <div className="text-gray-600 dark:text-gray-400">
                Guide information coming soon...
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  hasExternalLink = false,
  variant = "default",
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  hasExternalLink?: boolean;
  variant?: "default" | "danger";
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium w-full text-left transition-all duration-200 group",
        active
          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]"
          : variant === "danger"
          ? "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20"
          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-zinc-800/60 hover:shadow-md"
      )}
      onClick={onClick}
    >
      <span
        className={cn(
          "transition-colors duration-200",
          active
            ? "text-white"
            : "text-gray-500 dark:text-gray-400 group-hover:text-current"
        )}
      >
        {icon}
      </span>
      <span className="font-medium">{label}</span>
      {hasExternalLink && (
        <ExternalLink size={16} className="ml-auto opacity-60" />
      )}
    </button>
  );
}

function ProfileContent({
  profile,
}: {
  profile?: { username: string; email?: string; avatar_url?: string };
}) {
  const firstLetter = profile?.username
    ? profile.username.substring(0, 1).toUpperCase()
    : "U";

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-8">
        <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/25">
          {firstLetter}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Display Name
          </h3>
          <Input
            defaultValue={profile?.username || ""}
            className="max-w-md border-gray-300 dark:border-zinc-700 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm"
          />
        </div>
      </div>

      <Card className="border-gray-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Account Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Email Address
            </h4>
            <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800/50 px-4 py-3 rounded-lg">
              {profile?.email || "No email provided"}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Password
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Set a unique password to protect your ChatEbook account.
            </p>
            <Button
              variant="outline"
              className="border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl"
            >
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UsageContent({ apiUsage }: { apiUsage?: ApiUsageData[] }) {
  const usageData = apiUsage || [];

  const getUsageIcon = (resourceType: string) => {
    switch (resourceType) {
      case "GENERATE_MIND_MAP":
        return <Brain className="w-6 h-6" />;
      case "SEND_MESSAGE":
        return <Send className="w-6 h-6" />;
      case "SUMMARIZE_EBOOK":
        return <FileText className="w-6 h-6" />;
      case "UPLOAD_EBOOK":
        return <Upload className="w-6 h-6" />;
      default:
        return <BarChart3 className="w-6 h-6" />;
    }
  };

  const getUsageLabel = (resourceType: string) => {
    switch (resourceType) {
      case "GENERATE_MIND_MAP":
        return "Mind Maps Generated";
      case "SEND_MESSAGE":
        return "Messages Sent";
      case "SUMMARIZE_EBOOK":
        return "Ebooks Summarized";
      case "UPLOAD_EBOOK":
        return "Ebooks Uploaded";
      default:
        return resourceType.replace(/_/g, " ").toLowerCase();
    }
  };

  const getUsageColor = (resourceType: string) => {
    switch (resourceType) {
      case "GENERATE_MIND_MAP":
        return "from-purple-500 to-pink-600";
      case "SEND_MESSAGE":
        return "from-blue-500 to-cyan-600";
      case "SUMMARIZE_EBOOK":
        return "from-green-500 to-emerald-600";
      case "UPLOAD_EBOOK":
        return "from-orange-500 to-red-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const totalUsage = usageData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          API Usage Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your API usage across different features
        </p>
      </div>

      <Card className="border-gray-200/50 dark:border-zinc-800/50 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Total Usage
          </CardTitle>
          <CardDescription>Your overall API consumption</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {totalUsage}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total API calls made
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {usageData.map((usage) => (
          <Card
            key={usage.resource_type}
            className="border-gray-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-3 rounded-xl bg-gradient-to-br shadow-lg",
                    getUsageColor(usage.resource_type)
                  )}
                >
                  <div className="text-white">
                    {getUsageIcon(usage.resource_type)}
                  </div>
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-200">
                    {getUsageLabel(usage.resource_type)}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Current usage count
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {usage.count}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  calls
                </span>
              </div>
              <Progress
                value={totalUsage > 0 ? (usage.count / totalUsage) * 100 : 0}
                className="h-2 bg-gray-200 dark:bg-zinc-700"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {totalUsage > 0
                  ? `${((usage.count / totalUsage) * 100).toFixed(
                      1
                    )}% of total usage`
                  : "No usage yet"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {usageData.length === 0 && (
        <Card className="border-gray-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Usage Data
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Start using the API features to see your usage statistics here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
