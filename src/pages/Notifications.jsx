import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pb } from "../lib/pb";
import { Bell, ArrowLeft, Check, Info, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔒 Security Check
    if (!pb.authStore.isValid) {
      navigate("/login");
      return;
    }

    const fetchNotifications = async () => {
      try {
        const userId = pb.authStore.model.id;
        // Fetch only notifications belonging to this specific user
        const records = await pb.collection("notifications").getFullList({
          filter: `user = "${userId}"`,
          sort: "-created", // Newest first
        });
        setNotifications(records);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // 🔥 Real-time subscription to get notified instantly
    pb.collection("notifications").subscribe("*", function (e) {
      if (e.action === "create" || e.action === "update") {
        fetchNotifications();
      }
    });

    return () => pb.collection("notifications").unsubscribe("*");
  }, [navigate]);

  const markAsRead = async (id) => {
    try {
      await pb.collection("notifications").update(id, { is_read: true });
      // Update local state immediately for snappy UI
      setNotifications(prev => 
        prev.map(notif => notif.id === id ? { ...notif, is_read: true } : notif)
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.is_read);
      await Promise.all(unread.map(n => pb.collection("notifications").update(n.id, { is_read: true })));
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  // Helper to render the right icon based on notification type
  const renderIcon = (type) => {
    switch (type) {
      case "success": return <CheckCircle2 className="text-green-500 w-6 h-6" />;
      case "warning": return <AlertTriangle className="text-yellow-500 w-6 h-6" />;
      default: return <Info className="text-accent w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Header & Back Button */}
        <div className="flex justify-between items-center mb-8">
          <button 
            className="flex items-center gap-2 text-gray-500 hover:text-brand font-bold transition-colors" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} /> Back
          </button>

          {notifications.some(n => !n.is_read) && (
            <button 
              onClick={markAllAsRead}
              className="text-sm font-bold text-accent hover:text-blue-700 transition"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-extrabold text-brand mb-8 flex items-center gap-3">
            <Bell className="text-accent w-8 h-8" /> Your Notifications
          </h1>

          {loading ? (
            <div className="text-center py-10 text-gray-400 font-medium animate-pulse">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="text-gray-300 w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-600">All caught up!</h3>
              <p className="text-gray-400 mt-1">You have no new notifications at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-5 rounded-2xl border flex gap-4 transition-all ${
                    notif.is_read ? "bg-white border-gray-100" : "bg-blue-50/50 border-blue-100 shadow-sm"
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {renderIcon(notif.type)}
                  </div>
                  
                  <div className="flex-grow">
                    <h4 className={`text-lg font-bold ${notif.is_read ? "text-gray-700" : "text-brand"}`}>
                      {notif.title}
                    </h4>
                    <p className={`mt-1 text-sm ${notif.is_read ? "text-gray-500" : "text-gray-700 font-medium"}`}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-3 font-medium">
                      {new Date(notif.created).toLocaleString()}
                    </p>
                  </div>

                  {!notif.is_read && (
                    <button 
                      onClick={() => markAsRead(notif.id)}
                      className="flex-shrink-0 self-start p-2 hover:bg-blue-100 rounded-full transition text-accent"
                      title="Mark as read"
                    >
                      <Check size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}