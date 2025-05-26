import { useMyProfile } from "@/hooks/use-my-profile";
import { useMyConversation } from "@/hooks/use-my-conversation";
import { useRevokeToken } from "@/hooks/use-revoke-token";
import { useDeleteConversation } from "@/hooks/use-delete-conversation";
import { useUpdateConversation } from "@/hooks/use-update-conversation";
import { CONVERSATION_PER_PAGE } from "@/common";
import { SidebarHeader } from "./sidebar-header";
import { NewChatButton } from "./newchat-button";
import { ConversationList } from "./conversation-list";
import { SidebarFooter } from "./sidebar-footer";
import { useAuthActions, useAuthStore } from "@/stores/use-auth-store";

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AppSidebar({
  isCollapsed,
  onToggleCollapse,
}: AppSidebarProps) {
  const { data: profile } = useMyProfile();
  const { data: conversations } = useMyConversation({
    sort: "id",
    order: "desc",
    page: 1,
    paging: CONVERSATION_PER_PAGE,
  });
  const deleteConv = useDeleteConversation();
  const updateConv = useUpdateConversation();
  const { mutate: revokeToken } = useRevokeToken({
    onSuccess: () => window.location.assign("/sign-in"),
  });
  const { signOut } = useAuthActions();

  const handleSignOut = () => {
    const { refreshToken } = useAuthStore.getState();
    if (refreshToken) {
      revokeToken({ refresh_token: refreshToken });
    } else {
      window.location.assign("/sign-in");
    }
    signOut();
  };

  return (
    <div className="black-sidebar h-screen flex flex-col">
      <SidebarHeader
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      />
      {!isCollapsed && (
        <>
          <NewChatButton />
          <ConversationList
            conversations={conversations?.data || []}
            onRename={(id, name) =>
              updateConv.mutate({ conversationId: id, data: { name } })
            }
            onDelete={(id) => deleteConv.mutate(id)}
          />
          <SidebarFooter
            profile={profile?.data || null}
            onSignOut={handleSignOut}
          />
        </>
      )}
    </div>
  );
}
