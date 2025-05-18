import type React from "react"
import { useState } from "react"
import { Bell, Clock, CreditCard, ExternalLink, LogOut, MessageSquare, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface UserProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile?: {
    username: string
    email?: string
    avatar_url?: string
  }
  onSignOut?: () => void
}

export default function UserProfileModal({ open, onOpenChange, profile, onSignOut }: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0 gap-0 border-none shadow-xl bg-white dark:bg-zinc-900">
        <DialogHeader className="p-6 border-b border-gray-200 dark:border-zinc-800">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">Settings</DialogTitle>
        </DialogHeader>

        <div className="flex h-[500px]">
          <div className="w-[200px] border-r border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
            <nav className="flex flex-col p-2 space-y-1">
              <NavItem
                icon={<User size={18} />}
                label="My profile"
                active={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
              />
              <NavItem
                icon={<Settings size={18} />}
                label="Preference"
                active={activeTab === "preference"}
                onClick={() => setActiveTab("preference")}
              />
              <NavItem
                icon={<MessageSquare size={18} />}
                label="Response model"
                active={activeTab === "model"}
                onClick={() => setActiveTab("model")}
              />
              <NavItem
                icon={<CreditCard size={18} />}
                label="Subscription"
                active={activeTab === "subscription"}
                onClick={() => setActiveTab("subscription")}
              />
              <NavItem
                icon={<Clock size={18} />}
                label="Billing history"
                active={activeTab === "billing"}
                onClick={() => setActiveTab("billing")}
              />
              <NavItem
                icon={<Bell size={18} />}
                label="Guide"
                active={activeTab === "guide"}
                onClick={() => setActiveTab("guide")}
                hasExternalLink
              />
            </nav>
            <div className="absolute bottom-0 left-0 w-[200px] p-2 border-t border-gray-200 dark:border-zinc-800">
              <NavItem
                icon={<LogOut size={18} />}
                label="Sign out"
                onClick={() => {
                  if (onSignOut) {
                    onSignOut()
                    onOpenChange(false)
                  }
                }}
              />
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "profile" && <ProfileContent profile={profile} />}
            {activeTab === "preference" && <div>Preference settings</div>}
            {activeTab === "model" && <div>Response model settings</div>}
            {activeTab === "subscription" && <div>Subscription settings</div>}
            {activeTab === "billing" && <div>Billing history</div>}
            {activeTab === "guide" && <div>Guide information</div>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function NavItem({
  icon,
  label,
  active = false,
  hasExternalLink = false,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  hasExternalLink?: boolean
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium w-full text-left transition-colors",
        active
          ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800",
      )}
      onClick={onClick}
    >
      <span className="text-gray-500 dark:text-gray-400">{icon}</span>
      <span>{label}</span>
      {hasExternalLink && <ExternalLink size={14} className="ml-auto opacity-60" />}
    </button>
  )
}

function ProfileContent({ profile }: { profile?: { username: string; email?: string; avatar_url?: string } }) {
  const firstLetter = profile?.username ? profile.username.substring(0, 1).toUpperCase() : "U"

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-semibold">
          {firstLetter}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name</h3>
          <Input
            defaultValue={profile?.username || ""}
            className="max-w-md border-gray-300 dark:border-zinc-700 focus:border-orange-500 focus:ring-orange-500/20"
          />
        </div>
      </div>

      <div>
        <h3 className="text-base font-medium mb-2 text-gray-800 dark:text-gray-200">Account security</h3>
        <Separator className="mb-4 bg-gray-200 dark:bg-zinc-700" />

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{profile?.email || "No email provided"}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Password</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Set a unique password to protect your personal ChatEbook account.
            </p>
            <Button
              variant="outline"
              className="border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              Set a password
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
