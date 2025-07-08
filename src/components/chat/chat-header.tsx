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
import { useTranslation } from "react-i18next";

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
  onSummarizeEbook,
  onClearConversation,
  onExportConversation,
  onGenerateMindmap,
  isSummarizing = false,
  isGeneratingMindmap = false,
  className = "",
}: ChatHeaderProps) {
  const { t } = useTranslation();
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
        title: t("chat_header.link_copied"),
        description: t("chat_header.link_copied_desc"),
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.log(error);
      toast({
        title: t("chat_header.failed_copy"),
        description: t("chat_header.failed_copy_desc"),
        variant: "destructive",
      });
    }
  };

  const handleEmailShare = async () => {
    if (!shareEmail.trim()) {
      toast({
        title: t("chat_header.email_required"),
        description: t("chat_header.email_required_desc"),
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: t("chat_header.conversation_shared"),
        description: t("chat_header.conversation_shared_desc", {
          email: shareEmail,
        }),
      });
      setShareDialogOpen(false);
      setShareEmail("");
      setShareMessage("");
    } catch (error) {
      console.log(error);
      toast({
        title: t("chat_header.failed_share"),
        description: t("chat_header.failed_share_desc"),
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleClearConversation = () => {
    if (window.confirm(t("chat_header.clear_confirm"))) {
      onClearConversation?.();
      toast({
        title: t("chat_header.conversation_cleared"),
        description: t("chat_header.conversation_cleared_desc"),
      });
    }
  };

  return (
    <div
      className={`h-14 flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 ${className}`}
    >
      {/* Title Section - Optimized */}
      <div className="flex items-center min-w-0 flex-1">
        <div className="flex items-center space-x-2 min-w-0">
          <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
            {t("chat_header.title")}
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
            aria-label={
              isSummarizing
                ? t("chat_header.summarizing")
                : t("chat_header.summarize")
            }
            title={t("chat_header.summarize")}
          >
            {isSummarizing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <BookOpen className="h-3.5 w-3.5" />
                <span>{t("chat_header.summarize")}</span>
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
              isGeneratingMindmap
                ? t("chat_header.generating")
                : t("chat_header.mindmap")
            }
            title={t("chat_header.mindmap")}
          >
            {isGeneratingMindmap ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <GitBranch className="h-3.5 w-3.5" />
                <span>{t("chat_header.mindmap")}</span>
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
                aria-label={t("chat_header.quick_actions")}
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
                {isSummarizing
                  ? t("chat_header.summarizing")
                  : t("chat_header.summarize")}
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
                {isGeneratingMindmap
                  ? t("chat_header.generating")
                  : t("chat_header.mindmap")}
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
              aria-label={t("chat_header.more_actions")}
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setShareDialogOpen(true)}>
              <Share2 className="h-4 w-4 mr-2" />
              {t("chat_header.share_chat")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportConversation}>
              <Download className="h-4 w-4 mr-2" />
              {t("chat_header.export_chat")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleClearConversation}
              className="text-red-600 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t("chat_header.clear_conversation")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("chat_header.share_conversation")}</DialogTitle>
            <DialogDescription>
              {t("chat_header.share_description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("chat_header.share_link")}</Label>
              <div className="flex items-center space-x-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button
                  onClick={handleCopyLink}
                  size="sm"
                  variant="outline"
                  className="flex items-center space-x-1"
                  aria-label={
                    isCopied
                      ? t("chat_header.link_copied")
                      : t("chat_header.copy_link")
                  }
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
              <Label htmlFor="share-email">
                {t("chat_header.share_via_email")}
              </Label>
              <Input
                id="share-email"
                type="email"
                placeholder={t("chat_header.email_placeholder")}
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
              <Textarea
                placeholder={t("chat_header.message_placeholder")}
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                rows={3}
              />
              <Button
                onClick={handleEmailShare}
                disabled={isSharing}
                className="w-full"
                aria-label={
                  isSharing
                    ? t("chat_header.sharing")
                    : t("chat_header.send_email")
                }
              >
                {isSharing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t("chat_header.sharing")}
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    {t("chat_header.send_email")}
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
