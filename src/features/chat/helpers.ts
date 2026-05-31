import type { Conversation } from "@/schemas/conversation";

export const getConversationTitle = (
  conversation: Conversation,
  currentUserId: string | undefined,
): string => {
  if (conversation.name) return conversation.name;
  const other = conversation.members.find((m) => m.userId !== currentUserId);
  return other?.user?.username ?? "Conversation";
};

export const getConversationAvatar = (
  conversation: Conversation,
  currentUserId: string | undefined,
): string | undefined => {
  if (conversation.avatar) return conversation.avatar;
  const other = conversation.members.find((m) => m.userId !== currentUserId);
  return other?.user?.avatar;
};
