import type React from "react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  FileText,
  MessageSquare,
  Plus,
  Languages,
  Sparkles,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  LogIn,
  LogOut,
  MoreHorizontal,
  Edit2,
  Trash2,
  Check,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useMyProfile } from "@/hooks/use-my-profile"
import { useMyConversation } from "@/hooks/use-my-conversation"
import { useRevokeToken } from "@/hooks/use-revoke-token"
import { useDeleteConversation } from "@/hooks/use-delete-conversation"
import { useUpdateConversation } from "@/hooks/use-update-conversation"

interface AppSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export default function AppSidebar({ isCollapsed, onToggleCollapse }: AppSidebarProps) {
  const location = useLocation()
  const pathname = location.pathname
  const { data: profile } = useMyProfile()
  const { data: conversations } = useMyConversation()

  const { mutate: deleteConversation, isPending: isDeleting } = useDeleteConversation()
  const { mutate: updateConversation, isPending: isUpdating } = useUpdateConversation()

  const [editingConversationId, setEditingConversationId] = useState<string | null>(null)
  const [newConversationName, setNewConversationName] = useState("")

  const [deletingConversationId, setDeletingConversationId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { mutate: revokeToken, isPending: revoking } = useRevokeToken({
    onSuccess: () => {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      window.location.href = "/sign-in"
    },
    onError: (error) => {
      console.error("Failed to revoke token: ", error)
    },
  })

  const handleSignOut = () => {
    const refreshToken = localStorage.getItem("refreshToken")
    if (refreshToken) {
      revokeToken({ refresh_token: refreshToken })
    } else {
      window.location.href = "/sign-in"
    }
  }

  const handleEditClick = (conversationId: string, currentName: string) => {
    setEditingConversationId(conversationId)
    setNewConversationName(currentName)
  }

  const handleRenameSubmit = async () => {
    if (!editingConversationId || !newConversationName.trim()) {
      setEditingConversationId(null)
      return
    }

    updateConversation(
      {
        conversationId: editingConversationId,
        data: { name: newConversationName.trim() },
      },
      {
        onSuccess: () => {
          setEditingConversationId(null)
        },
      },
    )
  }

  const handleDeleteClick = (conversationId: string) => {
    setDeletingConversationId(conversationId)
    setDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingConversationId) return

    deleteConversation(deletingConversationId, {
      onSuccess: () => {
        setDeletingConversationId(null)
        setDialogOpen(false)
      },
      onError: () => {
        setDeletingConversationId(null)
        setDialogOpen(false)
      },
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRenameSubmit()
    } else if (e.key === "Escape") {
      setEditingConversationId(null)
    }
  }

  if (isCollapsed) {
    return (
      <div className="black-sidebar-collapsed flex justify-center items-center h-full">
        <Button variant="ghost" onClick={onToggleCollapse} title="Expand sidebar">
          <PanelLeftOpen className="h-5 w-5 text-white" />
        </Button>
      </div>
    )
  }

  return (
    <div className="black-sidebar h-screen flex flex-col">
      <div className="flex items-center justify-between p-4">
        <Link to="/">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-white" />
            <span className="brand-name truncate">ChatEbook</span>
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          title="Collapse sidebar"
          className="hover:bg-zinc-800 rounded-full h-8 w-8 flex items-center justify-center"
        >
          <PanelLeftClose className="h-5 w-5 text-white" />
        </Button>
      </div>

      <div className="px-4 space-y-2">
        <Link to="/upload">
          <Button className="w-full justify-start truncate bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 border-none shadow-md shadow-purple-900/20">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-auto px-4 py-2">
        {conversations?.data.map((conversation) => (
          <div
            key={conversation.id}
            className={`flex items-center justify-between p-2 rounded-lg group transition-all duration-200 ${
              pathname === `/chat/${conversation.id}` ? "bg-zinc-800/90 shadow-sm" : "hover:bg-zinc-900/60"
            }`}
          >
            {editingConversationId === conversation.id ? (
              <div className="flex items-center space-x-1 w-full">
                <Input
                  value={newConversationName}
                  onChange={(e) => setNewConversationName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-8 py-1 bg-zinc-900/90 border-zinc-700 text-white rounded-md focus-visible:ring-purple-600/50"
                  autoFocus
                  disabled={isUpdating}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20 rounded-full"
                  onClick={handleRenameSubmit}
                  disabled={isUpdating}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700/50 rounded-full"
                  onClick={() => setEditingConversationId(null)}
                  disabled={isUpdating}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Link to={`/chat/${conversation.id}`} className="flex items-center space-x-3 flex-1 min-w-0">
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      pathname === `/chat/${conversation.id}`
                        ? "bg-purple-600/20 text-purple-400"
                        : "bg-zinc-800 text-zinc-400 group-hover:text-zinc-300"
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate text-sm font-medium">{conversation.name}</span>
                </Link>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full hover:bg-zinc-800"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 dropdown-menu-content">
                    <DropdownMenuItem
                      onClick={() => handleEditClick(conversation.id, conversation.name)}
                      className="dropdown-menu-item"
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      Rename conversation
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="dropdown-menu-separator" />
                    <DropdownMenuItem
                      className="dropdown-menu-item danger"
                      onClick={() => handleDeleteClick(conversation.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete conversation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="footer-section p-4 space-y-2 border-t border-zinc-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="language-dropdown-trigger">
              <div className="flex items-center">
                <Languages className="mr-2 h-4 w-4 text-zinc-400" />
                <span>EN</span>
              </div>
              <ChevronDown className="h-4 w-4 text-zinc-400 chevron" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dropdown-menu-content">
            <DropdownMenuItem className="dropdown-menu-item">English</DropdownMenuItem>
            <DropdownMenuItem className="dropdown-menu-item">Spanish</DropdownMenuItem>
            <DropdownMenuItem className="dropdown-menu-item">French</DropdownMenuItem>
            <DropdownMenuItem className="dropdown-menu-item">German</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {profile?.data.username ? (
          <>
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/40">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8 ring-2 ring-purple-600/20">
                  <AvatarImage src={profile?.data.avatar_url || "/placeholder.svg"} referrerPolicy="no-referrer" />
                  <AvatarFallback className="bg-purple-600/20 text-purple-200">
                    {profile?.data.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="truncate text-sm font-medium">{profile?.data.username}</span>
                  <span className="text-xs text-zinc-500">Free Plan</span>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                title="Sign Out"
                disabled={revoking}
                className="h-8 w-8 rounded-full hover:bg-zinc-800"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 border-none shadow-md shadow-purple-900/20">
              <Sparkles className="mr-2 h-4 w-4" />
              Upgrade to Plus
            </Button>
          </>
        ) : (
          <Link to="/sign-in">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 border-none shadow-md shadow-purple-900/20">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </Link>
        )}
      </div>

      <AlertDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setDeletingConversationId(null)
          }
        }}
      >
        <AlertDialogContent className="alert-dialog-content">
          <AlertDialogHeader>
            <AlertDialogTitle className="alert-dialog-title">Delete conversation</AlertDialogTitle>
            <AlertDialogDescription className="alert-dialog-description">
              Are you sure you want to delete this conversation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="alert-dialog-footer">
            <AlertDialogCancel className="alert-dialog-cancel">Cancel</AlertDialogCancel>
            <AlertDialogAction className="alert-dialog-action" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}