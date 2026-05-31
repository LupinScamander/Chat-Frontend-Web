/**
 * Tracks in-flight optimistic messages so we can reconcile when the server
 * acks via `message_queued`. The ack event may omit conversationId, so we
 * remember it locally keyed by clientMessageId.
 */
const pendingByClientId = new Map<string, string>();

export const trackPending = (clientMessageId: string, conversationId: string): void => {
  pendingByClientId.set(clientMessageId, conversationId);
};

export const consumePending = (clientMessageId: string): string | undefined => {
  const convId = pendingByClientId.get(clientMessageId);
  if (convId) pendingByClientId.delete(clientMessageId);
  return convId;
};

export const dropPending = (clientMessageId: string): void => {
  pendingByClientId.delete(clientMessageId);
};
