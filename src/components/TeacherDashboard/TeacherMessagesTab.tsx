import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  MapPin,
  Clock,
} from 'lucide-react';
import { MessageThread, User } from '../../types';
import { MOCK_MESSAGE_THREADS } from '../../data/mockData';
import { sendMessageNotificationEmail } from '../../services/emailService';

interface TeacherMessagesTabProps {
  currentUser: User;
}

export const TeacherMessagesTab: React.FC<TeacherMessagesTabProps> = ({ currentUser }) => {
  const [threads, setThreads] = useState<MessageThread[]>(MOCK_MESSAGE_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0]?.id || '');
  const [replyText, setReplyText] = useState('');

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;

    const messageText = replyText.trim();
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: messageText,
      timestamp: 'Just now',
      read: true,
    };

    const updatedThreads = threads.map((t) => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          lastMessage: messageText,
          lastMessageDate: 'Just now',
          messages: [...t.messages, newMessage],
        };
      }
      return t;
    });

    setThreads(updatedThreads);
    setReplyText('');

    // Trigger Resend email notification
    const recipientName = activeThread.buyerId === currentUser.id ? activeThread.sellerName : activeThread.buyerName;
    sendMessageNotificationEmail({
      senderName: currentUser.name,
      senderRole: currentUser.role === 'teacher_seller' ? 'Verified Teacher' : 'Educator',
      recipientName,
      recipientEmail: 'educator@school.edu',
      messageText,
      productTitle: activeThread.productTitle,
      threadId: activeThread.id,
    }).catch((err) => console.warn('Resend message alert failed:', err));
  };

  const handleAcceptOffer = (threadId: string, offerId: string) => {
    const updatedThreads = threads.map((t) => {
      if (t.id === threadId && t.offer) {
        return {
          ...t,
          offer: { ...t.offer, status: 'accepted' as const },
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              text: `I have accepted your offer of $${t.offer.amount.toFixed(2)}! You can now proceed to checkout or schedule school pickup.`,
              timestamp: 'Just now',
              read: true,
            },
          ],
        };
      }
      return t;
    });
    setThreads(updatedThreads);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs h-[650px] flex flex-col md:flex-row">
      {/* Left Sidebar: Threads List */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Classroom Messages</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Direct chat & price offers with verified educators
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {threads.map((t) => {
            const otherUserName = t.buyerId === currentUser.id ? t.sellerName : t.buyerName;
            const otherUserAvatar = t.buyerId === currentUser.id ? t.sellerAvatar : t.buyerAvatar;
            const isSelected = t.id === activeThread?.id;

            return (
              <div
                key={t.id}
                onClick={() => setActiveThreadId(t.id)}
                className={`p-3.5 cursor-pointer transition-colors flex items-start gap-3 ${
                  isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-100'
                }`}
              >
                <img
                  src={otherUserAvatar}
                  alt={otherUserName}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-400 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 truncate">{otherUserName}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{t.lastMessageDate}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-blue-700 truncate">{t.productTitle}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{t.lastMessage}</p>
                  {t.offer && t.offer.status === 'pending' && (
                    <span className="inline-block mt-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                      Offer: ${t.offer.amount} Pending
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Chat Area */}
      {activeThread ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Thread Top Bar */}
          <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={
                  activeThread.buyerId === currentUser.id
                    ? activeThread.sellerAvatar
                    : activeThread.buyerAvatar
                }
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border border-emerald-400"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {activeThread.buyerId === currentUser.id
                    ? activeThread.sellerName
                    : activeThread.buyerName}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Regarding listing: <strong className="text-slate-800">{activeThread.productTitle}</strong>
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Educator
              </span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/40">
            {/* Offer banner if exists */}
            {activeThread.offer && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    <span>Price Negotiation Offer: ${activeThread.offer.amount.toFixed(2)}</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    {activeThread.offer.status}
                  </span>
                </div>
                <p className="text-xs text-amber-800">
                  {activeThread.offer.note || 'Classroom purchase offer submitted by fellow teacher.'}
                </p>
                {activeThread.offer.status === 'pending' &&
                  activeThread.sellerId === currentUser.id && (
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() =>
                          handleAcceptOffer(activeThread.id, activeThread.offer!.id)
                        }
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg shadow-xs"
                      >
                        Accept ${activeThread.offer.amount.toFixed(2)}
                      </button>
                      <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs px-3 py-1.5 rounded-lg">
                        Decline
                      </button>
                    </div>
                  )}
              </div>
            )}

            {activeThread.messages.map((m) => {
              const isMe = m.senderId === currentUser.id;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    <p className="font-bold text-[11px] mb-0.5 opacity-80">{m.senderName}</p>
                    <p>{m.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
                </div>
              );
            })}
          </div>

          {/* Reply Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type message to teacher..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-blue-600"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
          Select a message to start conversation
        </div>
      )}
    </div>
  );
};
