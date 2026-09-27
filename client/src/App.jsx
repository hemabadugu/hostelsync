import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Navbar from './components/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import WardenDashboard from './pages/WardenDashboard.jsx';
import SafetyBotDrawer from './components/SafetyBotDrawer.jsx';
import NotificationDrawer from './components/NotificationDrawer.jsx';

// Initialize Socket.io instance
const socket = io('http://localhost:5000', {
  autoConnect: true,
  reconnection: true
});

function MainApp() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Real-time notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'complaint',
      title: 'Complaint Triaged by AI',
      message: 'Ticket CMP-2026-104 categorized under Plumbing (SLA: 24 Hours).',
      time: 'Just now',
      aiTag: 'Complaint Agent'
    },
    {
      id: 2,
      type: 'leave',
      title: 'Leave Recommended',
      message: 'AI Agent evaluated Leave LVE-802 with 94% approval rating.',
      time: '1h ago',
      aiTag: 'Leave Agent'
    }
  ]);

  // Setup Socket.io real-time event listeners
  useEffect(() => {
    socket.on('connect', () => {
      console.log('⚡ [Socket.io Client] Connected to server ID:', socket.id);
    });

    // 1. New Complaint Event
    socket.on('new_complaint', (data) => {
      setNotifications(prev => [
        {
          id: Date.now(),
          type: 'complaint',
          title: '🚨 New Maintenance Ticket',
          message: `Ticket ${data.ticketId || 'CMP-NEW'}: ${data.title || 'Complaint submitted'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          aiTag: 'Real-Time Alert'
        },
        ...prev
      ]);
    });

    // 2. Complaint Resolved Event
    socket.on('complaint_updated', (data) => {
      setNotifications(prev => [
        {
          id: Date.now(),
          type: 'complaint',
          title: '✅ Ticket Status Updated',
          message: `Complaint ${data.ticketId} marked as ${data.status}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          aiTag: 'SLA Engine'
        },
        ...prev
      ]);
    });

    // 3. Fee Received Event
    socket.on('fee_received', (data) => {
      setNotifications(prev => [
        {
          id: Date.now(),
          type: 'payment',
          title: '💳 Hostel Fee Received',
          message: `Payment of ₹${data.amount || '65,000'} received via Razorpay.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          aiTag: 'Razorpay Sync'
        },
        ...prev
      ]);
    });

    // 4. Leave Approved Event
    socket.on('leave_decision', (data) => {
      setNotifications(prev => [
        {
          id: Date.now(),
          type: 'leave',
          title: `📜 Leave Request ${data.status}`,
          message: `Leave ${data.leaveId || ''} for ${data.reason || 'Leave'} has been ${data.status}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          aiTag: 'Warden Action'
        },
        ...prev
      ]);
    });

    // 5. Visitor Arrived Event
    socket.on('visitor_updated', (data) => {
      setNotifications(prev => [
        {
          id: Date.now(),
          type: 'visitor',
          title: '👤 Visitor Gate Pass Updated',
          message: `Visitor ${data.guestName || 'Guest'} status: ${data.status}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          aiTag: 'Gate Pass Engine'
        },
        ...prev
      ]);
    });

    return () => {
      socket.off('connect');
      socket.off('new_complaint');
      socket.off('complaint_updated');
      socket.off('fee_received');
      socket.off('leave_decision');
      socket.off('visitor_updated');
    };
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadNotifications={notifications.length}
        onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
        onToggleBot={() => setIsBotOpen(!isBotOpen)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {!user ? (
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        ) : user.role === 'student' ? (
          <StudentDashboard user={user} />
        ) : user.role === 'warden' ? (
          <WardenDashboard user={user} />
        ) : (
          /* Admin Overview Dashboard */
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
            <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
              <h1 className="text-3xl font-extrabold text-white">Chief Admin Dashboard</h1>
              <p className="text-sm text-slate-400">HostelSync System Configuration & Global Antigravity Agent Fleet</p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10">
                  <span className="text-xs text-slate-400">Total Hostels</span>
                  <div className="text-2xl font-extrabold text-indigo-400 mt-1">6 Blocks</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10">
                  <span className="text-xs text-slate-400">Active Students</span>
                  <div className="text-2xl font-extrabold text-emerald-400 mt-1">1,420</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10">
                  <span className="text-xs text-slate-400">AI Agents Active</span>
                  <div className="text-2xl font-extrabold text-purple-400 mt-1">4 Agents</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10">
                  <span className="text-xs text-slate-400">System Status</span>
                  <div className="text-2xl font-extrabold text-cyan-400 mt-1">100% Operational</div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() => setUser({ ...user, role: 'student' })}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white"
                >
                  Switch View to Student Dashboard
                </button>
                <button
                  onClick={() => setUser({ ...user, role: 'warden' })}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white"
                >
                  Switch View to Warden Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating AI Drawer Widget */}
      <SafetyBotDrawer
        isOpen={isBotOpen}
        onClose={() => setIsBotOpen(false)}
      />

      {/* Real-time Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleClearNotifications}
      />

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 text-center text-xs text-slate-500">
        HostelSync © 2026 — AI-Orchestrated MERN Hostel Management Platform
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
