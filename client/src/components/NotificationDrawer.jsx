import React from 'react';
import { Bell, X, CheckCircle2, AlertTriangle, UserCheck, CreditCard, Sparkles } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose, notifications, onMarkAllRead }) {
  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'complaint':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'leave':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'visitor':
        return <UserCheck className="w-4 h-4 text-cyan-400" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-indigo-400" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[380px] bg-slate-900/95 backdrop-blur-2xl border-l border-indigo-500/20 shadow-2xl flex flex-col transition-all">
      
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Real-Time Notifications</h3>
            <p className="text-[11px] text-slate-400">Powered by Socket.io Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button 
              onClick={onMarkAllRead}
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 underline"
            >
              Clear
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-indigo-400" />
            <p className="text-xs">No unread notifications right now.</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div 
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-800/80 border border-white/10 hover:border-indigo-500/40 transition-all flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-slate-900 border border-white/5 flex-shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-100">{item.title}</h4>
                  <span className="text-[10px] text-slate-500">{item.time}</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{item.message}</p>
                {item.aiTag && (
                  <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] border border-indigo-500/20 font-medium">
                    <Sparkles className="w-3 h-3 text-indigo-400" /> {item.aiTag}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
