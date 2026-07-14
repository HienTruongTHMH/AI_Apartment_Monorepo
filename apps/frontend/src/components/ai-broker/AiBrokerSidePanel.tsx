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
  CheckCircle2
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
      text: `Xin chào ${user?.fullName || 'quý khách'}! Tôi là **AI Broker Agent** của AI Apartment Monorepo. Tôi có thể giúp bạn tìm căn hộ theo ngân sách, vị trí, tiện ích hoặc phong cách sống. Hãy thử nhập hoặc nói yêu cầu của bạn!`,
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
        text: 'Hệ thống AI Broker đang cập nhật dữ liệu. Bạn vui lòng thử lại sau giây lát!',
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
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-3.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-white shadow-[0_0_25px_rgba(16,185,129,0.35)] backdrop-blur-xl hover:border-emerald-400 transition-all group"
      >
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <div className="relative w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-xs font-semibold tracking-wide text-emerald-400 flex items-center gap-1">
            <span>AI BROKER ASSISTANT</span>
            <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-[11px] text-gray-400">Tư vấn thuê nhà thông minh 24/7</div>
        </div>
      </motion.button>

      {/* Slide Panel Overlay & Container */}
      <AnimatePresence>
        {aiPanelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiPanelOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Side Drawer */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[#0d1424] border-l border-emerald-500/20 shadow-2xl flex flex-col glass-panel"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      AI Broker Agent
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Online
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400">AI Apartment Smart Match</p>
                  </div>
                </div>
                <button
                  onClick={() => setAiPanelOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-md'
                          : 'bg-slate-900/90 border border-white/10 text-gray-200 rounded-bl-none shadow-lg backdrop-blur-md'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>

                      {/* Render recommended listing 3D cards if any */}
                      {msg.recommendedListings && msg.recommendedListings.length > 0 && (
                        <div className="mt-3.5 space-y-2.5 pt-2 border-t border-white/10">
                          <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Gợi ý từ AI:
                          </p>
                          {msg.recommendedListings.map((item) => (
                            <Link
                              key={item.listing_id}
                              href={`/apartment/${item.listing_id}`}
                              onClick={() => setAiPanelOpen(false)}
                              className="group block p-2.5 rounded-xl bg-slate-950/70 border border-emerald-500/20 hover:border-emerald-400 transition-all hover:scale-[1.02]"
                            >
                              <div className="flex gap-3 items-center">
                                {item.imageUrl ? (
                                  <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-14 h-14 object-cover rounded-lg border border-white/10"
                                  />
                                ) : (
                                  <div className="w-14 h-14 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                    <Building2 className="w-6 h-6" />
                                  </div>
                                )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-semibold text-white group-hover:text-emerald-300 truncate">
                                      {item.title}
                                    </h4>
                                    <div className="text-[11px] text-gray-400 mt-0.5 flex flex-wrap items-center gap-1.5">
                                      {item.roomNumber && <span>P.{item.roomNumber}</span>}
                                      {item.area ? <span>• {item.area}m²</span> : null}
                                      {item.district ? <span>• {item.district}</span> : null}
                                      {item.bedroom ? <span>• {item.bedroom} PN</span> : null}
                                    </div>
                                    {item.reason && (
                                      <p className="text-[10px] text-emerald-300/90 mt-1 line-clamp-2 italic">
                                        &quot;{item.reason}&quot;
                                      </p>
                                    )}
                                    <div className="text-xs font-bold text-amber-400 mt-1">
                                      {((item.pricePerMonth ?? item.price) || 0).toLocaleString('vi-VN')} đ/tháng
                                    </div>
                                  </div>
                                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 px-1">{msg.timestamp}</span>
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-emerald-400 text-xs bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-xl max-w-xs">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>........</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="px-4 py-2 border-t border-white/5 bg-slate-950/40 flex gap-2 overflow-x-auto no-scrollbar text-xs">
                {[
                  'Căn hộ Studio dưới 15tr',
                  'Sky Villa view sông',
                  'Khu vực Bình Thạnh 2PN',
                  'Full nội thất Thủ Thiêm'
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSend(chip)}
                    className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-900 border border-white/10 hover:border-emerald-500/40 text-gray-300 hover:text-emerald-300 transition-all text-[11px]"
                  >
                    + {chip}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3.5 border-t border-white/10 bg-slate-950/80">
                {isListening && (
                  <div className="mb-2.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-emerald-300 text-xs animate-pulse">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Đang lắng nghe giọng nói... (nói câu lệnh của bạn)
                    </span>
                    <button onClick={toggleVoiceRecording} className="text-gray-400 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                      isListening
                        ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-bounce'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/40'
                    }`}
                    title="Nhập liệu bằng giọng nói"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Nhập yêu cầu căn hộ (VD: Căn hộ 2PN view đẹp)..."
                    className="flex-1 bg-slate-900 border border-white/10 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!inputQuery.trim() || loading}
                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
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
