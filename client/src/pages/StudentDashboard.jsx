import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { 
  Building2, 
  Home, 
  CreditCard, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  FileText, 
  UserCheck, 
  Bot, 
  Wifi, 
  Zap, 
  ShieldAlert, 
  Download, 
  Plus, 
  ChevronRight 
} from 'lucide-react';

export default function StudentDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Live REST Data States
  const [roomData, setRoomData] = useState(null);
  const [feesData, setFeesData] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);

  // Fetch Live Student REST Data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const [roomRes, feesRes, attRes, compRes, leaveRes] = await Promise.all([
          axiosClient.get('/student/room').catch(() => null),
          axiosClient.get('/student/fees').catch(() => null),
          axiosClient.get('/student/attendance').catch(() => null),
          axiosClient.get('/student/complaints').catch(() => null),
          axiosClient.get('/student/leave').catch(() => null)
        ]);

        if (roomRes?.data?.data) setRoomData(roomRes.data.data);
        if (feesRes?.data?.data) setFeesData(feesRes.data.data);
        if (attRes?.data?.data) setAttendanceData(attRes.data.data);
        if (compRes?.data?.data?.length > 0) setComplaints(compRes.data.data);
        if (leaveRes?.data?.data?.length > 0) setLeaveRequests(leaveRes.data.data);
      } catch (err) {
        console.warn('REST API fetch error, utilizing reactive client fallback:', err.message);
      }
    };

    fetchStudentData();
  }, []);

  // Razorpay Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Complaints State
  const [complaints, setComplaints] = useState([
    {
      id: 'CMP-2026-104',
      title: 'Water Heater Leaking in Room B-204 Bathroom',
      category: 'Plumbing',
      priority: 'HIGH',
      status: 'In Progress',
      date: '2026-09-24',
      assignedTo: 'Plumbing Staff (Rajesh M.)',
      slaHours: 24,
      aiTriage: 'Auto-triaged by Complaint Agent (SLA: 24h)'
    },
    {
      id: 'CMP-2026-089',
      title: 'Wi-Fi Access Point Low Speed on 2nd Floor',
      category: 'Network',
      priority: 'MEDIUM',
      status: 'Resolved',
      date: '2026-09-18',
      assignedTo: 'IT Desk',
      slaHours: 48,
      aiTriage: 'Resolved by IT Support'
    }
  ]);

  const [newComplaintTitle, setNewComplaintTitle] = useState('');
  const [newComplaintCategory, setNewComplaintCategory] = useState('Plumbing');
  const [aiTriagePreview, setAiTriagePreview] = useState(null);

  // Leave Requests State
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 'LVE-802',
      reason: 'Attending Cousin Sister Marriage in Jaipur',
      fromDate: '2026-10-02',
      toDate: '2026-10-06',
      status: 'Approved',
      aiRecommendation: 'APPROVE (Attendance 88% >= 75%)',
      appliedOn: '2026-09-22'
    }
  ]);

  const [leaveReason, setLeaveReason] = useState('');
  const [leaveFrom, setLeaveFrom] = useState('');
  const [leaveTo, setLeaveTo] = useState('');
  const [aiLeavePreview, setAiLeavePreview] = useState(null);

  // AI Triage calculation on complaint input
  const handleComplaintChange = (val) => {
    setNewComplaintTitle(val);
    const textLower = val.toLowerCase();
    if (textLower.length > 5) {
      if (textLower.includes('leak') || textLower.includes('water') || textLower.includes('pipe')) {
        setAiTriagePreview({ category: 'Plumbing', priority: 'HIGH', sla: '24 Hours', department: 'Maintenance Dept' });
        setNewComplaintCategory('Plumbing');
      } else if (textLower.includes('light') || textLower.includes('fan') || textLower.includes('power') || textLower.includes('socket')) {
        setAiTriagePreview({ category: 'Electrical', priority: 'HIGH', sla: '12 Hours', department: 'Electrical Maintenance' });
        setNewComplaintCategory('Electrical');
      } else if (textLower.includes('wifi') || textLower.includes('internet') || textLower.includes('net')) {
        setAiTriagePreview({ category: 'Network', priority: 'MEDIUM', sla: '48 Hours', department: 'Campus IT Network' });
        setNewComplaintCategory('Network');
      } else {
        setAiTriagePreview({ category: 'General', priority: 'MEDIUM', sla: '36 Hours', department: 'Facilities Management' });
      }
    } else {
      setAiTriagePreview(null);
    }
  };

  const handlePostComplaint = (e) => {
    e.preventDefault();
    if (!newComplaintTitle.trim()) return;

    const newTicket = {
      id: `CMP-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: newComplaintTitle,
      category: aiTriagePreview ? aiTriagePreview.category : newComplaintCategory,
      priority: aiTriagePreview ? aiTriagePreview.priority : 'MEDIUM',
      status: 'Pending Assignment',
      date: new Date().toISOString().split('T')[0],
      assignedTo: aiTriagePreview ? aiTriagePreview.department : 'General Staff',
      slaHours: aiTriagePreview ? parseInt(aiTriagePreview.sla) : 24,
      aiTriage: `Auto-categorized by Complaint Agent (${aiTriagePreview ? aiTriagePreview.priority : 'MEDIUM'} Priority)`
    };

    setComplaints([newTicket, ...complaints]);
    setNewComplaintTitle('');
    setAiTriagePreview(null);
  };

  // AI Leave Recommendation calculation
  const handleCheckLeave = () => {
    if (!leaveReason || !leaveFrom || !leaveTo) return;
    const attendancePct = 88; // Aarav Sharma student attendance score
    if (attendancePct >= 75) {
      setAiLeavePreview({
        recommendation: 'APPROVE',
        confidence: '94%',
        reason: `Student attendance (${attendancePct}%) satisfies institutional cutoff (>75%). No active hostel disciplinary flags.`
      });
    } else {
      setAiLeavePreview({
        recommendation: 'REJECT',
        confidence: '89%',
        reason: `Student attendance (${attendancePct}%) is below requirement. Warden review mandatory.`
      });
    }
  };

  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!leaveReason || !leaveFrom || !leaveTo) return;

    const newLeave = {
      id: `LVE-${Math.floor(800 + Math.random() * 100)}`,
      reason: leaveReason,
      fromDate: leaveFrom,
      toDate: leaveTo,
      status: 'Pending Warden Approval',
      aiRecommendation: aiLeavePreview ? `${aiLeavePreview.recommendation} (${aiLeavePreview.confidence})` : 'Pending AI Check',
      appliedOn: new Date().toISOString().split('T')[0]
    };

    setLeaveRequests([newLeave, ...leaveRequests]);
    setLeaveReason('');
    setLeaveFrom('');
    setLeaveTo('');
    setAiLeavePreview(null);
  };

  const handlePayFee = async () => {
    try {
      // 1. Create Order
      const orderRes = await axiosClient.post('/payments/create-order', { amount: 65000, feeType: 'FullSemester' });
      const orderData = orderRes?.data?.data;

      // 2. Verify Payment
      await axiosClient.post('/payments/verify', {
        razorpayOrderId: orderData?.orderId || 'order_Nzk9204185',
        razorpayPaymentId: 'pay_Nzk9204185102',
        razorpaySignature: 'sig_mock_verified',
        paymentId: orderData?.paymentId
      });
    } catch (err) {
      console.warn('Payment API error fallback:', err.message);
    }

    setPaymentSuccess(true);
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentSuccess(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Student Welcome Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Resident Student Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, <span className="text-indigo-400">{user?.name || 'Aarav Sharma'}</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              {user?.hostelBlock || 'Block B (Aryabhata)'} • Room {user?.roomNumber || 'B-204'} • Roll #{user?.id || 'STU-901'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/10 text-center">
              <span className="block text-xs font-medium text-slate-400">Attendance</span>
              <span className="text-lg font-extrabold text-emerald-400">88.5%</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/10 text-center">
              <span className="block text-xs font-medium text-slate-400">Fee Dues</span>
              <span className="text-lg font-extrabold text-indigo-400">₹0 / Paid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Room Allotment', icon: Home },
          { id: 'fees', label: 'Fee Payments', icon: CreditCard },
          { id: 'attendance', label: 'Attendance & Gate Pass', icon: Clock },
          { id: 'complaints', label: 'AI Complaint Tracker', icon: AlertTriangle },
          { id: 'leave', label: 'Leave Applications', icon: FileText }
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/60 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & ROOM DETAILS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Room Card */}
          <div className="lg:col-span-8 glass-card p-6 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg">Room Allocation Details</h3>
                  <p className="text-xs text-slate-400">Assigned by Antigravity Room Allocation Agent</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                Occupied / Verified
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[11px] text-slate-400 block font-medium">Hostel Block</span>
                <span className="text-sm font-bold text-white mt-1 block">Block B (Aryabhata)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[11px] text-slate-400 block font-medium">Room Number</span>
                <span className="text-sm font-bold text-indigo-400 mt-1 block">B-204 (2nd Floor)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[11px] text-slate-400 block font-medium">Bed Assigned</span>
                <span className="text-sm font-bold text-white mt-1 block">Bed #02 (Window Side)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[11px] text-slate-400 block font-medium">Room Type</span>
                <span className="text-sm font-bold text-white mt-1 block">Double Occupancy AC</span>
              </div>
            </div>

            {/* Roommate Section */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Assigned Roommate</h4>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 font-bold text-white flex items-center justify-center text-sm shadow-md">
                    VS
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">Vikram Sharma</h5>
                    <p className="text-xs text-slate-400">Computer Science & Engg • Year 3</p>
                  </div>
                </div>
                <span className="text-xs text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 font-medium">
                  95% Compatibility Match
                </span>
              </div>
            </div>

            {/* Room Amenities */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Included Amenities</h4>
              <div className="flex items-center gap-3 flex-wrap">
                {['High-Speed Wi-Fi', 'Air Conditioner', 'Study Desk & Lamp', 'Attached Balcony', '24x7 Power Backup'].map((amenity, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Warden Contact & Rules Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-6 rounded-3xl space-y-4">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                Block Warden Desk
              </h3>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                <p className="text-xs font-bold text-white">Dr. R. K. Verma</p>
                <p className="text-[11px] text-slate-400">Chief Warden — Block B</p>
                <p className="text-[11px] text-indigo-300 font-mono">Office Hours: 04:00 PM - 07:00 PM</p>
                <p className="text-[11px] text-slate-400">Contact: +91-9876543210</p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl space-y-3 bg-gradient-to-b from-indigo-950/40 to-slate-900">
              <div className="flex items-center gap-2 text-indigo-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <h4 className="text-sm font-bold">HostelSync AI Tip</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Need to raise a maintenance ticket? Submit your request under AI Complaint Tracker to get auto-prioritized SLA resolution.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: FEE PAYMENTS & RAZORPAY */}
      {activeTab === 'fees' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 glass-card p-6 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-extrabold text-white text-lg">Semester Hostel Fee Statement</h3>
                <p className="text-xs text-slate-400">Academic Session 2026–2027 (Odd Semester)</p>
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
              >
                <CreditCard className="w-4 h-4" /> Pay Outstanding Dues
              </button>
            </div>

            {/* Breakdown Table */}
            <div className="space-y-3">
              {[
                { title: 'Hostel Room Rent (Double AC)', amount: '₹35,000', status: 'Paid' },
                { title: 'Mess Advance Fee', amount: '₹22,000', status: 'Paid' },
                { title: 'Caution Deposit (Refundable)', amount: '₹5,000', status: 'Paid' },
                { title: 'Amenities & Wi-Fi Charge', amount: '₹3,000', status: 'Paid' }
              ].map((fee, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white">{fee.title}</h5>
                    <span className="text-[11px] text-slate-400 font-mono">{fee.amount}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                    {fee.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Paid Header */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-200">Total Semester Dues Completed</span>
              <span className="text-base font-extrabold text-white font-mono">₹65,000</span>
            </div>
          </div>

          <div className="lg:col-span-4 glass-card p-6 rounded-3xl space-y-4">
            <h3 className="font-extrabold text-white text-base">Payment Receipt Generator</h3>
            <p className="text-xs text-slate-400">Download officially signed institutional hostel fee receipts for income tax or loan reimbursement.</p>
            <button
              onClick={() => alert("Downloading HostelSync Fee Receipt 2026.pdf...")}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" /> Download Official Receipt PDF
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: ATTENDANCE & GATE PASS */}
      {activeTab === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 glass-card p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-lg">Biometric Night Attendance</h3>
                <p className="text-xs text-slate-400">Monthly Hostel Gate Biometric Sync</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/70 border border-white/10 text-center space-y-2">
              <span className="text-4xl font-extrabold text-emerald-400">88.5%</span>
              <p className="text-xs text-slate-300 font-semibold">Attendance Record (Good Standing)</p>
              <p className="text-[11px] text-slate-400">Minimum 75% attendance required for overnight out-pass recommendation.</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase">Recent Gate Logs</h4>
              {[
                { date: '2026-09-24', checkIn: '09:42 PM', status: 'In Hostel (Before Curfew)' },
                { date: '2026-09-23', checkIn: '09:15 PM', status: 'In Hostel (Before Curfew)' },
                { date: '2026-09-22', checkIn: '09:50 PM', status: 'In Hostel (Before Curfew)' }
              ].map((log, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/50 border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-mono">{log.date}</span>
                  <span className="text-indigo-400 font-semibold">{log.checkIn}</span>
                  <span className="text-emerald-400 text-[11px]">{log.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 glass-card p-6 rounded-3xl space-y-4">
            <h3 className="font-extrabold text-white text-base">Request Evening Out-Pass</h3>
            <p className="text-xs text-slate-400">For returning after 08:30 PM within campus perimeter.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Out-Pass request generated. Show QR code at security gate."); }} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Destination & Purpose</label>
                <input type="text" required placeholder="Library / Academic Block" className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Expected Return Time</label>
                <input type="time" defaultValue="21:45" className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs">
                Generate Gate Pass QR
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: COMPLAINT TRACKER */}
      {activeTab === 'complaints' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Post Complaint Form */}
          <div className="lg:col-span-5 glass-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <Bot className="w-5 h-5 text-indigo-400" />
              <h3 className="font-extrabold text-white text-base">Submit Hostel Maintenance Ticket</h3>
            </div>
            <p className="text-xs text-slate-400">Antigravity AI Complaint Agent will parse your problem description and calculate priority SLA.</p>

            <form onSubmit={handlePostComplaint} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Complaint Description</label>
                <textarea
                  rows="3"
                  required
                  value={newComplaintTitle}
                  onChange={(e) => handleComplaintChange(e.target.value)}
                  placeholder="e.g. Bathroom pipe leak in B-204, Wi-Fi speed dropping, or fan noise..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* AI Real-time Triage Live Preview */}
              {aiTriagePreview && (
                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                    <span>AI Complaint Triage Preview</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div><span className="text-slate-400">Category:</span> <span className="text-white font-bold">{aiTriagePreview.category}</span></div>
                    <div><span className="text-slate-400">Priority:</span> <span className="text-rose-400 font-bold">{aiTriagePreview.priority}</span></div>
                    <div><span className="text-slate-400">Resolution SLA:</span> <span className="text-emerald-400 font-bold">{aiTriagePreview.sla}</span></div>
                    <div><span className="text-slate-400">Assignee:</span> <span className="text-slate-200">{aiTriagePreview.department}</span></div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> File Maintenance Ticket
              </button>
            </form>
          </div>

          {/* Complaints List */}
          <div className="lg:col-span-7 glass-card p-6 rounded-3xl space-y-4">
            <h3 className="font-extrabold text-white text-base">Your Raised Complaints</h3>
            <div className="space-y-3">
              {complaints.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400">{item.id}</span>
                      <h4 className="text-xs font-bold text-white mt-0.5">{item.title}</h4>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                      item.status === 'Resolved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap pt-1 border-t border-white/5">
                    <span>Category: <strong className="text-slate-200">{item.category}</strong></span>
                    <span>Priority: <strong className="text-rose-400">{item.priority}</strong></span>
                    <span>Assignee: <strong className="text-slate-200">{item.assignedTo}</strong></span>
                  </div>

                  <div className="text-[10px] text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-400" /> {item.aiTriage}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: LEAVE APPLICATION */}
      {activeTab === 'leave' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 glass-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <Bot className="w-5 h-5" />
              <h3 className="font-extrabold text-white text-base">Apply Night/Home Leave</h3>
            </div>
            <p className="text-xs text-slate-400">The Leave Agent checks your attendance score before submitting to Warden.</p>

            <form onSubmit={handleApplyLeave} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Reason for Leave</label>
                <input
                  type="text"
                  required
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="e.g. Festival visit home / Family function"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={leaveFrom}
                    onChange={(e) => setLeaveFrom(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={leaveTo}
                    onChange={(e) => setLeaveTo(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckLeave}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Run AI Leave Pre-Check
              </button>

              {aiLeavePreview && (
                <div className="p-3.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-300">AI Recommendation:</span>
                    <span className={aiLeavePreview.recommendation === 'APPROVE' ? 'text-emerald-400' : 'text-rose-400'}>
                      {aiLeavePreview.recommendation}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{aiLeavePreview.reason}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30"
              >
                Submit Leave Application
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 glass-card p-6 rounded-3xl space-y-4">
            <h3 className="font-extrabold text-white text-base">Submitted Leave Requests</h3>
            <div className="space-y-3">
              {leaveRequests.map((lve) => (
                <div key={lve.id} className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400">{lve.id}</span>
                      <h4 className="text-xs font-bold text-white mt-0.5">{lve.reason}</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {lve.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Duration: {lve.fromDate} to {lve.toDate}</p>
                  <div className="text-[10px] text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                    AI Agent Recommendation: {lve.aiRecommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RAZORPAY MOCK PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 max-w-md w-full space-y-6">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 mx-auto mb-2 shadow-lg shadow-emerald-500/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <h3 className="text-lg font-extrabold text-white">Razorpay Secure Checkout</h3>
              <p className="text-xs text-slate-400">HostelSync Merchant ID: HSTL-RAZOR-2026</p>
            </div>

            {paymentSuccess ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-white">Payment Received!</h4>
                <p className="text-xs text-slate-300">Transaction ID: pay_Nzk9204185102</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Hostel Dues Total</span>
                    <span className="text-white font-bold font-mono">₹65,000.00</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Razorpay Gateway Fee</span>
                    <span className="text-emerald-400 font-bold font-mono">₹0.00 (Waived)</span>
                  </div>
                </div>

                <button
                  onClick={handlePayFee}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25"
                >
                  Confirm & Pay ₹65,000
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
