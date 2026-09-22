import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaBars, FaBell, FaCheck } from "react-icons/fa";
import { useNotifications } from "@/context/notifications/useNotifications";

const PrivateNavbar = ({ onToggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <header className="h-[70px] w-full bg-[#0B1F3A] border-b border-slate-800 fixed top-0 left-0 z-40 flex items-center justify-between px-4 sm:px-6 shadow-md">
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden text-slate-200 hover:text-white p-1 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <FaBars className="text-xl" />
        </button>

        <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
          Servi<span className="text-red-500">Casa</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition"
            aria-label="Notifications"
          >
            <FaBell className="text-xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-[#0B1F3A]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 text-slate-800">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#0B1F3A]">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                      {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-[#0B1F3A] hover:underline font-semibold"
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Aucune notification pour le moment.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 flex items-start justify-between gap-3 text-xs transition ${
                        notif.read ? "bg-white opacity-70" : "bg-blue-50/50 font-medium"
                      }`}
                    >
                      <div className="space-y-1 flex-1">
                        <p className="text-slate-800 leading-snug">{notif.message}</p>
                        {notif.date && (
                          <span className="text-[10px] text-slate-400 block">
                            {new Date(notif.date).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          title="Marquer comme lue"
                          className="text-slate-400 hover:text-green-600 p-1 rounded-md transition"
                        >
                          <FaCheck size={12} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Link
          to="/profile"
          className="flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg border border-white/10"
        >
          <FaUserCircle className="text-xl text-slate-300" />
          <span className="hidden sm:inline">Mon profil</span>
        </Link>
      </div>
    </header>
  );
};

export default PrivateNavbar;