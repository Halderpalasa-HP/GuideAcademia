import React from 'react';
import { Bell, Check, Sparkles, Tag, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { promoNotifications, markNotificationAsRead, currentUser } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full dark:bg-black bg-white border-l dark:border-zinc-800 border-zinc-200 shadow-2xl flex flex-col transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-zinc-50 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500 border dark:border-emerald-500/30 border-emerald-300">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold dark:text-white text-zinc-900">Notifications & Alertes</h3>
              <p className="text-[11px] dark:text-zinc-400 text-zinc-500">Offres et annonces de la communauté</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 dark:text-zinc-400 text-zinc-500 hover:dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:text-white hover:text-black"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 dark:bg-black bg-white">
          {promoNotifications.length === 0 ? (
            <div className="py-12 text-center dark:text-zinc-500 text-zinc-400 text-xs">
              Aucune notification active pour le moment.
            </div>
          ) : (
            promoNotifications.map((notif) => {
              const isRead = notif.readBy.includes(currentUser.id);
              return (
                <div
                  key={notif.id}
                  className={`rounded-xl border p-4 transition-all ${
                    isRead
                      ? 'dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-zinc-50 opacity-75'
                      : 'border-emerald-500/40 dark:bg-zinc-950 bg-emerald-50/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold dark:text-white text-zinc-900 flex items-center gap-1.5">
                      {notif.title}
                    </h4>
                    {!isRead && (
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{notif.message}</p>

                  {notif.code && (
                    <div className="mt-3 flex items-center justify-between rounded-lg border border-dashed border-indigo-500/40 bg-indigo-950/20 px-3 py-1.5">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-indigo-400" />
                        <span className="font-mono text-xs font-bold text-indigo-300">
                          {notif.code}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400">
                        -{notif.discountPercentage || 25}%
                      </span>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                    <span>{new Date(notif.createdAt).toLocaleDateString('fr-FR')}</span>
                    {!isRead && (
                      <button
                        onClick={() => markNotificationAsRead(notif.id)}
                        className="text-indigo-400 hover:text-indigo-300 font-sans flex items-center gap-1"
                      >
                        <Check className="h-3 w-3" />
                        Marquer comme lu
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
