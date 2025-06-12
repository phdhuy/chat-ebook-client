import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MessageSquare,
  MoreHorizontal,
  Edit2,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import InfiniteScroll from "react-infinite-scroll-component";
import type { ConversationInfoResponse } from "@/api/conversation-api";
import SkeletonLoader from "../skeleton/loader-skeleton";

type Grouped = Record<string, ConversationInfoResponse[]>;

interface ConversationListProps {
  conversations: ConversationInfoResponse[];
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  loadMore: () => void;
  hasMore: boolean;
}

export function ConversationList({
  conversations,
  onRename,
  onDelete,
  loadMore,
  hasMore,
}: ConversationListProps) {
  const location = useLocation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  function toMidnight(date: Date): Date {
    const midnight = new Date(date);
    midnight.setHours(0, 0, 0, 0);
    return midnight;
  }

  function groupByDate(convs: typeof conversations): Grouped {
    const todayMidnight = toMidnight(new Date());
    const buckets: Grouped = {
      Today: [],
      Yesterday: [],
      "Previous 7 Days": [],
      Older: [],
    };

    convs.forEach((conv) => {
      const convDate = toMidnight(new Date(conv.created_at || Date.now()));
      const diff = Math.floor(
        (todayMidnight.getTime() - convDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const key =
        diff === 0
          ? "Today"
          : diff === 1
          ? "Yesterday"
          : diff <= 7
          ? "Previous 7 Days"
          : "Older";
      buckets[key].push(conv);
    });
    return buckets;
  }

  const groups = groupByDate(conversations);

  return (
    <div
      id="conversation-list"
      className="flex-1 overflow-auto px-4 py-2 space-y-4"
    >
      <InfiniteScroll
        dataLength={conversations.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<SkeletonLoader />}
        scrollableTarget="conversation-list"
      >
        {Object.entries(groups).map(
          ([group, convs]) =>
            convs.length > 0 && (
              <div key={group} className="space-y-2">
                <h3 className="text-sm font-semibold text-zinc-500">{group}</h3>
                {convs.map((conv) => (
                  <div
                    key={conv.id}
                    className={`flex items-center justify-between p-2 rounded-lg group transition-all duration-200 ${
                      location.pathname === `/chat/${conv.id}`
                        ? "bg-zinc-800/90 shadow-sm"
                        : "hover:bg-zinc-900/60"
                    }`}
                  >
                    {editingId === conv.id ? (
                      <div className="flex items-center space-x-1 w-full">
                        <Input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              if (newName.trim() !== "") {
                                onRename(conv.id, newName.trim());
                                setEditingId(null);
                              }
                            }
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="h-8 py-1 bg-zinc-900/90 border-zinc-700 text-white rounded-md focus-visible:ring-purple-600/50"
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (newName.trim() !== "") {
                              onRename(conv.id, newName.trim());
                              setEditingId(null);
                            }
                          }}
                        >
                          <Check className="h-4 w-4 text-emerald-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingId(null)}
                        >
                          <X className="h-4 w-4 text-zinc-400" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Link
                          to={`/chat/${conv.id}`}
                          className="flex items-center space-x-3 flex-1 min-w-0"
                          title={conv.name}
                        >
                          <div
                            className={`${
                              location.pathname === `/chat/${conv.id}`
                                ? "bg-purple-600/20 text-purple-400"
                                : "bg-zinc-800 text-zinc-400 group-hover:text-zinc-300"
                            } flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center`}
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </div>
                          <span className="truncate text-sm font-medium">
                            {conv.name}
                          </span>
                        </Link>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:bg-zinc-800"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingId(conv.id);
                                setNewName(conv.name);
                              }}
                            >
                              <Edit2 className="mr-2 h-4 w-4" /> Rename
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onDelete(conv.id)}
                              className="text-red-500"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )
        )}
      </InfiniteScroll>
    </div>
  );
}