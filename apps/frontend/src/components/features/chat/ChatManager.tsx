'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useChat } from '@/lib/api-hooks';

interface ChatManagerProps {
  role: 'tenant' | 'owner';
}

export default function ChatManager({ role }: ChatManagerProps) {
  const { data: chats, isLoading, error } = useChat(role);
  return (
    <div className="w-full text-white h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-3xl font-extrabold mb-2 text-white">Tin nhắn</h1>
        <p className="text-gray-400 text-sm">
          {role === 'owner' 
            ? 'Quản lý tin nhắn với khách thuê và những người quan tâm căn hộ.'
            : 'Trao đổi với chủ nhà hoặc nhận hỗ trợ từ ban quản lý.'}
        </p>
      </div>

      <div className="flex-1 bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
            <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Chưa có cuộc trò chuyện nào</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3">
            {chats.map((chat: any, i: number) => (
              <div key={chat.id || i} className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-4 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 font-bold">
                  {(chat.title || 'U')[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{chat.title || 'Người dùng'}</h3>
                  <p className="text-sm text-gray-400 truncate max-w-md">{chat.lastMessage || '...'}</p>
                </div>
                <span className="text-xs text-gray-500">{chat.updatedAt ? new Date(chat.updatedAt).toLocaleDateString() : 'Gần đây'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
