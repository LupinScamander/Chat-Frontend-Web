'use client';

import { useEffect } from 'react';
import { useChat } from '@/hooks/useChat';

export default function ChatPage() {
  const { conversations, activeConversation, isLoading, loadConversations } = useChat();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-full sm:w-64 border-r border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No conversations</div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${
                  activeConversation?.id === conversation.id ? 'bg-blue-50' : ''
                }`}
              >
                <p className="font-medium text-gray-900">
                  {conversation.name || conversation.participants[0]?.name}
                </p>
                {conversation.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage.content}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="hidden sm:flex flex-1 flex-col">
        {activeConversation ? (
          <>
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeConversation.name || activeConversation.participants[0]?.name}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {/* Messages will be displayed here */}
              <p className="text-center text-gray-500">No messages yet</p>
            </div>
            <div className="border-t border-gray-200 p-4">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
