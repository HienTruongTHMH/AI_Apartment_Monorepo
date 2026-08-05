'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  X,
  Send,
  Mic,
  MicOff,
  Sparkles,
  Building2,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Zap,
  CheckCircle2,
  Smile,
  Paperclip
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { apiService } from '@/lib/api';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  recommendedListings?: Array<{
    listing_id: string;
    title: string;
    pricePerMonth?: number;
    price?: number;
    roomNumber?: string;
    area?: number;
    reason?: string;
    district?: string;
    bedroom?: number;
    imageUrl?: string;
  }>;
}

export default function AiBrokerSidePanel() {
  const { aiPanelOpen, toggleAiPanel, setAiPanelOpen, user } = useAuthStore();
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Xin chào ${user?.fullName || 'quý khách'}! Tôi là trợ lý ảo của NestaVIET. Tôi có thể giúp bạn tìm căn hộ theo ngân sách, vị trí, tiện ích hoặc phong cách sống. Hãy thử nhập hoặc nói yêu cầu của bạn!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recommendedListings: []
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (aiPanelOpen) {
      scrollToBottom();
    }
  }, [messages, aiPanelOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsgId = 'msg-' + Date.now();
    const userMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const history: Array<{ role: 'user' | 'assistant'; content: string }> = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await apiService.searchBroker(textToSend, history);

      const aiMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: res.reply || 'Dưới đây là một số căn hộ phù hợp nhất với tiêu chí của bạn:',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedListings: res.recommended_listings || []
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: Message = {
        id: 'err-' + Date.now(),
        sender: 'ai',
        text: 'Hệ thống trợ lý ảo đang cập nhật dữ liệu. Bạn vui lòng thử lại sau giây lát!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceRecording = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate speech recognition audio prompt
      setTimeout(() => {
        setIsListening(false);
        setInputQuery('Tìm cho tôi căn hộ 2 phòng ngủ dưới 20 triệu tại Bình Thạnh');
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Orb Widget at Bottom Right */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleAiPanel}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#E03C3D] hover:bg-[#C92F30] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(224,60,61,0.4)] transition-all duration-300 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z" strokeWidth="1.5" opacity="0.75" />
          <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
          <circle cx="10" cy="14" r="1" fill="currentColor" stroke="none" />
          <circle cx="14" cy="14" r="1" fill="currentColor" stroke="none" />
          <circle cx="6" cy="14" r="1" fill="currentColor" stroke="none" />
        </svg>
      </motion.button>

      {/* Slide Panel Overlay & Container */}
      <AnimatePresence>
        {aiPanelOpen && (
          <>
            {/* Invisible Click-away Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiPanelOpen(false)}
              className="fixed inset-0 z-40 bg-transparent"
            />

            {/* Popup Chat Window */}
            <motion.aside
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] h-[580px] max-h-[calc(100vh-120px)] bg-white border border-[#E8E8E8] rounded-2xl shadow-xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-[#E8E8E8] flex items-center justify-between bg-[#EAECEF]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E03C3D] flex items-center justify-center text-white shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2C2C2C] text-sm flex items-center gap-2">
                      NestaVIET Trợ Lý Ảo
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                        Online
                      </span>
                    </h3>
                    <p className="text-[10px] text-[#5A5A5A] leading-relaxed">Chào mừng bạn đến với NestaVIET</p>
                  </div>
                </div>
                <button
                  onClick={() => setAiPanelOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-black/5 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-[12px] text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#E03C3D] text-white rounded-br-none shadow-sm'
                          : 'bg-[#F0F2F5] border border-[#E8E8E8] text-[#2C2C2C] rounded-bl-none shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>

                      {/* Render recommended listing 3D cards if any */}
                      {msg.recommendedListings && msg.recommendedListings.length > 0 && (
                        <div className="mt-3 space-y-2.5 pt-2 border-t border-[#E8E8E8]">
                          <p className="text-[11px] font-semibold text-[#E03C3D] uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-[#E03C3D]" /> Gợi ý từ AI:
                          </p>
                          {msg.recommendedListings.map((item, idx) => (
                            <Link
                              key={`${item.listing_id}-${idx}`}
                              href={`/apartment/${item.listing_id}`}
                              onClick={() => setAiPanelOpen(false)}
                              className="group block p-2.5 rounded-[8px] bg-white border border-[#E8E8E8] hover:border-[#999999] transition-all hover:scale-[1.02]"
                            >
                              <div className="flex gap-3 items-center">
                                {item.imageUrl ? (
                                  <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-14 h-14 object-cover rounded-[6px] border border-[#E8E8E8]"
                                  />
                                ) : (
                                  <div className="w-14 h-14 rounded-[6px] bg-[#F2F2F2] border border-[#E8E8E8] flex items-center justify-center text-[#5A5A5A]">
                                    <Building2 className="w-6 h-6" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-semibold text-[#2C2C2C] group-hover:text-[#E03C3D] truncate">
                                    {item.title}
                                  </h4>
                                  <div className="text-[11px] text-[#5A5A5A] mt-0.5 flex flex-wrap items-center gap-1.5">
                                    {item.roomNumber && <span>P.{item.roomNumber}</span>}
                                    {item.area ? <span>• {item.area}m²</span> : null}
                                    {item.district ? <span>• {item.district}</span> : null}
                                    {item.bedroom ? <span>• {item.bedroom} PN</span> : null}
                                  </div>
                                  {item.reason && (
                                    <p className="text-[10px] text-[#5A5A5A]/90 mt-1 line-clamp-2 italic">
                                      &quot;{item.reason}&quot;
                                    </p>
                                  )}
                                  <div className="text-xs font-bold text-[#E03C3D] mt-1">
                                    {((item.pricePerMonth ?? item.price) || 0).toLocaleString('vi-VN')} đ/tháng
                                  </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#E03C3D] transition-colors" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-[#E03C3D] text-xs bg-[#FFF5F5] border border-[#E03C3D]/20 p-3 rounded-[12px] max-w-xs">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#E03C3D]" />
                    <span>Trợ lý ảo đang phản hồi.............</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="px-4 py-2 border-t border-[#E8E8E8] bg-[#F9F9F9] flex gap-2 overflow-x-auto no-scrollbar text-xs">
                {[
                  'Căn hộ Studio dưới 15tr',
                  'Sky Villa view sông',
                  'Khu vực Bình Thạnh 2PN',
                  'Full nội thất Thủ Thiêm'
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSend(chip)}
                    className="whitespace-nowrap px-3 py-1 rounded-full bg-white border border-[#E8E8E8] hover:border-[#999999] text-[#5A5A5A] hover:text-[#2C2C2C] transition-all text-[11px]"
                  >
                    + {chip}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-[#E8E8E8] bg-[#F0F2F5]">
                {isListening && (
                  <div className="mb-2.5 p-2 rounded-lg bg-red-50 border border-red-200 flex items-center justify-between text-[#E03C3D] text-xs animate-pulse">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E03C3D] animate-ping" />
                      Đang lắng nghe giọng nói... (nói câu lệnh của bạn)
                    </span>
                    <button onClick={toggleVoiceRecording} className="text-gray-400 hover:text-gray-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                      isListening
                        ? 'bg-red-100 border-red-300 text-[#E03C3D] animate-bounce'
                        : 'bg-white border border-[#E8E8E8] text-[#5A5A5A] hover:border-[#999999]'
                    }`}
                    title="Nhập liệu bằng giọng nói"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <div className="flex-1 bg-white border border-[#E8E8E8] focus-within:border-[#999999] rounded-full px-4 py-2 flex items-center gap-2 transition-colors">
                    <input
                      type="text"
                      value={inputQuery}
                      onChange={(e) => setInputQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Nhập tin nhắn"
                      className="bg-transparent text-[#2C2C2C] placeholder-[#999999] text-sm focus:outline-none flex-1 min-w-0"
                    />
                    <button type="button" className="text-[#4A5568] hover:text-[#2C2C2C] transition-colors shrink-0">
                      <Smile className="w-4 h-4" />
                    </button>
                    <button type="button" className="text-[#4A5568] hover:text-[#2C2C2C] transition-colors shrink-0">
                      <Paperclip className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!inputQuery.trim() || loading}
                    className="w-10 h-10 rounded-full bg-[#E03C3D] hover:bg-[#C92F30] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors duration-200"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
