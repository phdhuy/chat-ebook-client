import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Share2,
  BookOpen,
  MoreVertical,
  Download,
  Trash2,
  Settings,
  Copy,
  Mail,
  MessageSquare,
  Loader2,
  Check,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ChatHeaderProps {
  conversationId: string;
  conversationTitle?: string;
  onSummarizeEbook?: () => void;
  onClearConversation?: () => void;
  onExportConversation?: () => void;
  isSummarizing?: boolean;
  className?: string;
}

export function ChatHeader({
  conversationId,
  conversationTitle = "AI Chat",
  onSummarizeEbook,
  onClearConversation,
  onExportConversation,
  isSummarizing = false,
  className = "",
}: ChatHeaderProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const shareUrl = `${window.location.origin}/chat/${conversationId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleEmailShare = async () => {
    if (!shareEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Conversation shared!",
        description: `Conversation has been shared with ${shareEmail}`,
      });
      setShareDialogOpen(false);
      setShareEmail("");
      setShareMessage("");
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to share",
        description: "Could not share conversation via email",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleClearConversation = () => {
    if (
      window.confirm(
        "Are you sure you want to clear this conversation? This action cannot be undone."
      )
    ) {
      onClearConversation?.();
      toast({
        title: "Conversation cleared",
        description: "All messages have been removed",
      });
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 ${className}`}
    >
      {/* Left section - Title and info */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {conversationTitle}
          </h1>
        </div>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center space-x-2">
        {/* Share Button */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Conversation</DialogTitle>
              <DialogDescription>
                Share this conversation with others via link or email
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Copy Link Section */}
              <div className="space-y-2">
                <Label>Share Link</Label>
                <div className="flex items-center space-x-2">
                  <Input value={shareUrl} readOnly className="flex-1" />
                  <Button
                    onClick={handleCopyLink}
                    size="sm"
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Email Share Section */}
              <div className="space-y-2">
                <Label htmlFor="share-email">Share via Email</Label>
                <Input
                  id="share-email"
                  type="email"
                  placeholder="Enter email address"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                />
                <Textarea
                  placeholder="Add a message (optional)"
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleEmailShare}
                  disabled={isSharing}
                  className="w-full"
                >
                  {isSharing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Summarize Ebook Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onSummarizeEbook}
          disabled={isSummarizing}
          className="flex items-center space-x-2"
        >
          {isSummarizing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <BookOpen className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {isSummarizing ? "Summarizing..." : "Summarize"}
          </span>
        </Button>

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onExportConversation}>
              <Download className="h-4 w-4 mr-2" />
              Export Chat
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Chat Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleClearConversation}
              className="text-red-600 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
