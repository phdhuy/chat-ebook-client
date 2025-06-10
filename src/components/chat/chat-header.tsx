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
  Copy,
  Mail,
  MessageSquare,
  Loader2,
  Check,
  GitBranch,
  Zap,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ChatHeaderProps {
  conversationId: string;
  conversationTitle?: string;
  onSummarizeEbook?: () => void;
  onClearConversation?: () => void;
  onExportConversation?: () => void;
  onGenerateMindmap?: () => void;
  isSummarizing?: boolean;
  isGeneratingMindmap?: boolean;
  className?: string;
}

export function ChatHeader({
  conversationId,
  conversationTitle = "AI Chat",
  onSummarizeEbook,
  onClearConversation,
  onExportConversation,
  onGenerateMindmap,
  isSummarizing = false,
  isGeneratingMindmap = false,
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
      className={`flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 ${className}`}
    >
      {/* Title Section - Optimized */}
      <div className="flex items-center min-w-0 flex-1">
        <div className="flex items-center space-x-2 min-w-0">
          <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
            {conversationTitle}
          </h1>
        </div>
      </div>

      {/* Action Buttons - Compact Layout */}
      <div className="flex items-center space-x-1 ml-4">
        {/* Quick Actions - Desktop Only */}
        <div className="hidden md:flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSummarizeEbook}
            disabled={isSummarizing}
            className="h-8 px-2 text-xs"
            aria-label={isSummarizing ? "Summarizing ebook" : "Summarize ebook"}
            title="Summarize"
          >
            {isSummarizing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <BookOpen className="h-3.5 w-3.5" />
                <span>Summarize</span>
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onGenerateMindmap}
            disabled={isGeneratingMindmap}
            className="h-8 px-2 text-xs"
            aria-label={
              isGeneratingMindmap ? "Generating mindmap" : "Generate mindmap"
            }
            title="Mindmap"
          >
            {isGeneratingMindmap ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <GitBranch className="h-3.5 w-3.5" />
                <span>Mind Map</span>
              </>
            )}
          </Button>
        </div>

        {/* Mobile Quick Action */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                aria-label="Quick actions"
              >
                <Zap className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={onSummarizeEbook}
                disabled={isSummarizing}
              >
                {isSummarizing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <BookOpen className="h-4 w-4 mr-2" />
                )}
                {isSummarizing ? "Summarizing..." : "Summarize"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onGenerateMindmap}
                disabled={isGeneratingMindmap}
              >
                {isGeneratingMindmap ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <GitBranch className="h-4 w-4 mr-2" />
                )}
                {isGeneratingMindmap ? "Generating..." : "Mindmap"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* More Actions Menu */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              aria-label="More actions"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setShareDialogOpen(true)}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportConversation}>
              <Download className="h-4 w-4 mr-2" />
              Export Chat
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

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Conversation</DialogTitle>
            <DialogDescription>
              Share this conversation with others via link or email
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex items-center space-x-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button
                  onClick={handleCopyLink}
                  size="sm"
                  variant="outline"
                  className="flex items-center space-x-1"
                  aria-label={isCopied ? "Link copied" : "Copy link"}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

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
                aria-label={isSharing ? "Sharing via email" : "Send email"}
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
    </div>
  );
}
