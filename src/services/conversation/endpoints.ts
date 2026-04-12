export const POST_CONVERSATIONS = "/conversations";
export const GET_CONVERSATIONS = "/conversations";
export const GET_CONVERSATIONS_OPEN = (id: string) => `/conversations/${id}/open`;
export const PATCH_CONVERSATIONS_READ = (id: string) => `/conversations/${id}/read`;
export const POST_CONVERSATIONS_READ = (id: string) => `/conversations/${id}/read`;
export const POST_CONVERSATIONS_MEMBERS = (id: string) => `/conversations/${id}/members`;
export const DELETE_CONVERSATIONS_MEMBER = (id: string, userId: string) =>
  `/conversations/${id}/members/${userId}`;
