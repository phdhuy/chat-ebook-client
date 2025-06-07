import { useState, useEffect } from "react";
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
import { ConversationInfoResponse } from "@/api/conversation-api";

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AppSidebar({
  isCollapsed,
  onToggleCollapse,
}: AppSidebarProps) {
  const { data: profile } = useMyProfile();

  const [page, setPage] = useState(1);
  const [allConversations, setAllConversations] = useState<ConversationInfoResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data: conversations } = useMyConversation({
    sort: "id",
    order: "desc",
    page,
    paging: CONVERSATION_PER_PAGE,
  });

  useEffect(() => {
    if (conversations?.data) {
      setAllConversations((prev) => [...prev, ...conversations.data]);
      console.log(conversations.data.length);
      setHasMore(conversations.data.length === CONVERSATION_PER_PAGE);
    }
  }, [conversations]);

  const loadMore = () => {
    console.log("loadMore");
    setPage((prev) => prev + 1);
  };

  const deleteConv = useDeleteConversation();
  const updateConv = useUpdateConversation();

  const handleDeleteSuccess = (variables: string) => {
    setAllConversations((prev) => prev.filter((conv) => conv.id !== variables));
  };

  const handleUpdateSuccess = (updatedConv: ConversationInfoResponse) => {
    setAllConversations((prev) =>
      prev.map((conv) => (conv.id === updatedConv.id ? updatedConv : conv))
    );
  };

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
            conversations={allConversations}
            onRename={(id, name) =>
              updateConv.mutate({ conversationId: id, data: { name } }, {
                onSuccess: (data) => handleUpdateSuccess(data.data),
              })
            }
            onDelete={(id) => deleteConv.mutate(id, {
              onSuccess: () => handleDeleteSuccess(id),
            })}
            loadMore={loadMore}
            hasMore={hasMore}
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