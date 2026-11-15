import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import NotificationBell from '../../components/NotificationBell';
import ProfilePictureUpload from '../../components/ProfilePictureUpload';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend as RechartsLegend,
    LineChart, CartesianGrid, XAxis, YAxis, Line, BarChart, Bar
} from 'recharts';
// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, fill = "none", sw = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);
const HeartIcon = () => <Icon d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" size={24} />;
const FlaskIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3v10.55a4 4 0 1 0 6 0V3" /><line x1="6" y1="3" x2="18" y2="3" />
    </svg>
);
const CalIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const TestTubeIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2l-5 5v8.5a2.5 2.5 0 0 0 5 0V7l-5-5" /><path d="M9.5 7h5" />
    </svg>
);
const CheckIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const ClockIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);
const LogOutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);
const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
const UploadIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
);
const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

function ChartBarIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><line x1="2" y1="20" x2="22" y2="20"></line></svg>); }
function QueueIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>); }
function ProcessingIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>); }
function CompletedIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>); }
function CalendarIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>); }
function CatalogIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>); }

function AnalyticsView({ reports }) {
    const getCategoryBreakdown = () => {
        const categories = {};
        reports.forEach(r => {
            const cat = r.labTest?.category || 'OTHER';
            categories[cat] = (categories[cat] || 0) + 1;
        });
        return Object.keys(categories).map(k => ({ name: k, value: categories[k] }));
    };

    const getStatusDistribution = () => {
        const statuses = { 'Requested': 0, 'In Processing': 0, 'Completed': 0, 'Cancelled': 0 };
        reports.forEach(r => {
            if (r.status === 'REQUESTED' || r.status === 'PAID') statuses['Requested']++;
            else if (['SAMPLE_COLLECTED', 'IN_LAB', 'RESULT_READY'].includes(r.status)) statuses['In Processing']++;
            else if (r.status === 'COMPLETED') statuses['Completed']++;
            else if (r.status === 'CANCELLED') statuses['Cancelled']++;
        });
        return Object.keys(statuses).map(k => ({ name: k, value: statuses[k] }));
    };

    const getTestsVolTrend = () => {
        const days = [...Array(7)].map((_, i) => {
            const d = new Date(); d.setDate(d.getDate() - (6 - i));
            return { date: d.toISOString().split('T')[0], label: d.toLocaleString('default', { weekday: 'short' }), count: 0 };
        });
        
        reports.forEach(r => {
            if (r.labSlot?.testTime) {
                const dateStr = new Date(r.labSlot.testTime).toISOString().split('T')[0];
                const match = days.find(d => d.date === dateStr);
                if (match) match.count++;
            }
        });
        return days;
    };

    const catData = getCategoryBreakdown();
    const statusData = getStatusDistribution();
    const trendData = getTestsVolTrend();
    
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
    const PIE_COLORS = ['#f472b6', '#60a5fa', '#34d399', '#a78bfa', '#fbbf24', '#fb923c', '#9ca3af'];

    return (
        <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="table-card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: '#111827', fontSize: '1.1rem' }}>Overall Test Categories</h3>
                <div style={{ flex: 1, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {catData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={catData} cx="50%" cy="45%" innerRadius="55%" outerRadius="80%" paddingAngle={5} dataKey="value" stroke="none">
                                    {catData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                                </Pie>
                                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                                <RechartsLegend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>No data available</div>
                    )}
                </div>
            </div>

            <div className="table-card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: '#111827', fontSize: '1.1rem' }}>Test Volumes (Last 7 Days)</h3>
                <div style={{ flex: 1, minHeight: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} allowDecimals={false} />
                            <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                            <Line type="monotone" dataKey="count" name="Tests" stroke="#00C6A7" strokeWidth={3} dot={{ r: 4, fill: '#00C6A7', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, strokeWidth: 0 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="table-card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', width: '100%' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: '#111827', fontSize: '1.1rem' }}>Orders Status Breakdown</h3>
                <div style={{ flex: 1, minHeight: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statusData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} allowDecimals={false} />
                            <RechartsTooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                {statusData.map((e, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

// ── Status Config ─────────────────────────────────────────────────────────────
const STATUS = {
    REQUESTED: { label: 'Requested', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', icon: '🔵', step: 0 },
    PAID: { label: 'Paid & Confirmed', color: '#10b981', bg: 'rgba(16,185,129,0.12)', icon: '💰', step: 0 },
    SAMPLE_COLLECTED: { label: 'Sample Collected', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: '🟡', step: 1 },
    IN_LAB: { label: 'In Lab', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', icon: '🟣', step: 2 },
    RESULT_READY: { label: 'Result Ready', color: '#34d399', bg: 'rgba(52,211,153,0.12)', icon: '🟢', step: 3 },
    COMPLETED: { label: 'Completed', color: '#00c6a7', bg: 'rgba(0,198,167,0.12)', icon: '✅', step: 4 },
    CANCELLED: { label: 'Cancelled', color: '#f87171', bg: 'rgba(248,113,113,0.12)', icon: '❌', step: -1 },
};
const NEXT_STATUS = {
    REQUESTED: 'SAMPLE_COLLECTED',
    PAID: 'SAMPLE_COLLECTED',
    SAMPLE_COLLECTED: 'IN_LAB',
    IN_LAB: 'RESULT_READY',
    RESULT_READY: 'COMPLETED',
};
const NEXT_LABEL = {
    REQUESTED: '🧪 Mark Sample Collected',
    PAID: '🧪 Mark Sample Collected',
    SAMPLE_COLLECTED: '🔬 Move to Lab Processing',
    IN_LAB: '📤 Upload & Publish Results',
    RESULT_READY: '✅ Mark Completed',
};

// ── Category badge colors ─────────────────────────────────────────────────────
const CAT_COLOR = {
    HAEMATOLOGY: '#f472b6',
    BIOCHEMISTRY: '#60a5fa',
    MICROBIOLOGY: '#34d399',
    RADIOLOGY: '#a78bfa',
    ENDOCRINOLOGY: '#fbbf24',
    SEROLOGY: '#fb923c',
};

// ══════════════════════════════════════════════════════════════════════════════
export default function LabDashboard() {
    const { user, logout, updateProfile } = useAuth();
    const navigate = useNavigate();

    // Profile Settings
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ phone: '', twoFactorEnabled: false });
    const [saving, setSaving] = useState(false);
    const [profileImg, setProfileImg] = useState(null);

    useEffect(() => {
        if (user) {
            setEditForm({ phone: user.phone || '', twoFactorEnabled: user.twoFactorEnabled || false });
        }
    }, [user]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (profileImg) {
                const formData = new FormData();
                formData.append('file', profileImg);
                await api.post('/v1/uploads/profile-picture/me', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            await updateProfile(editForm);
            setEditModalOpen(false);
            window.location.reload();
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const [activeTab, setActiveTab] = useState('queue');
    const [reports, setReports] = useState([]);
    const [slots, setSlots] = useState([]);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});

    // Modals
    const [showSlotModal, setShowSlotModal] = useState(false);
    const [showTestModal, setShowTestModal] = useState(false);
    const [updatingReport, setUpdatingReport] = useState(null);
    const [editingTest, setEditingTest] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // Form state
    const [slotForm, setSlotForm] = useState({ date: '', time: '', endTime: '', capacity: '5' });
    const [reportForm, setReportForm] = useState({ notes: '', file: null });
    const [publishing, setPublishing] = useState(false);
    const [publishingError, setPublishingError] = useState('');
    const [testForm, setTestForm] = useState({
        name: '', description: '', price: '', category: 'BIOCHEMISTRY',
        prepInstructions: '', resourceRequired: '', durationMinutes: '30', fastingRequired: false
    });
    const [formErrors, setFormErrors] = useState({});
    const [testSaving, setTestSaving] = useState(false);

    // Using shared api instance from ../../api/axios

    useEffect(() => { fetchAll(); }, []);
    useEffect(() => { if (activeTab === 'catalog') fetchTests(); }, [activeTab]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [rr, sr, statsR] = await Promise.all([
                api.get('/v1/lab-reports/tech'),
                api.get('/v1/lab-slots/my'),
                api.get('/v1/lab-reports/stats').catch(() => ({ data: {} }))
            ]);
            setReports(rr.data);
            setSlots(sr.data);
            setStats(statsR.data || {});
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fetchTests = async () => {
        try {
            const r = await api.get('/v1/laboratory/tests/all');
            setTests(r.data);
        } catch (e) { console.error(e); }
    };

    const handleCreateSlot = async (e) => {
        e.preventDefault();
        try {
            if (!slotForm.endTime) {
                alert('Please select an end time for the slot.');
                return;
            }

            const startTimeVal = new Date(`${slotForm.date}T${slotForm.time}:00`);
            const endTimeVal = new Date(`${slotForm.date}T${slotForm.endTime}:00`);

            if (endTimeVal <= startTimeVal) {
                alert('End time must be after start time.');
                return;
            }

            const payload = {
                testTime: `${slotForm.date}T${slotForm.time}:00`,
                endTime: `${slotForm.date}T${slotForm.endTime}:00`,
                capacity: parseInt(slotForm.capacity)
            };
            await api.post('/v1/lab-slots/create', payload);
            setSlotForm({ date: '', time: '', endTime: '', capacity: '5' });
            setShowSlotModal(false);
            fetchAll();
        } catch (e) {
            console.error('Slot Creation Error:', e.response?.status, e.response?.data);
            alert('Failed to create slot: ' + (e.response?.data?.message || e.message));
        }
    };

    const handleSaveTest = async (e) => {
        e.preventDefault();
        setFormErrors({});

        // ── Form Validation ───────────────────────────────────────────────────
        let errors = {};
        if (!testForm.name || !testForm.name.trim()) {
            errors.name = 'Test name is required';
        }
        if (!testForm.category) {
            errors.category = 'Please select a category';
        }
        
        const price = parseFloat(testForm.price);
        if (!testForm.price || isNaN(price)) {
            errors.price = 'Price is required';
        } else if (price <= 0) {
            errors.price = 'Price must be greater than 0';
        }

        const duration = parseInt(testForm.durationMinutes);
        if (!testForm.durationMinutes || isNaN(duration)) {
            errors.durationMinutes = 'Duration is required';
        } else if (duration < 5) {
            errors.durationMinutes = 'Duration must be at least 5 minutes';
        } else if (duration > 480) {
            errors.durationMinutes = 'Duration cannot exceed 8 hours (480 min)';
        }

        if (!testForm.description || !testForm.description.trim()) {
            errors.description = 'Test description is required';
        } else if (testForm.description.length < 10) {
            errors.description = 'Description must be at least 10 characters long';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        // ─────────────────────────────────────────────────────────────────────

        setTestSaving(true);
        const payload = {
            ...testForm,
            price: price,
            durationMinutes: duration,
        };
        try {
            if (editingTest) {
                await api.put(`/v1/laboratory/tests/${editingTest.id}`, payload);
            } else {
                await api.post('/v1/laboratory/tests', payload);
            }
            setShowTestModal(false);
            setEditingTest(null);
            setTestForm({ name: '', description: '', price: '', category: 'BIOCHEMISTRY', prepInstructions: '', resourceRequired: '', durationMinutes: '30', fastingRequired: false });
            setFormErrors({});
            fetchTests();
        } catch (e) { 
            alert('Failed to save test: ' + (e.response?.data?.message || e.message)); 
        } finally {
            setTestSaving(false);
        }
    };

    const handleToggleTest = async (id, currentActive) => {
        try {
            await api.patch(`/v1/laboratory/tests/${id}/toggle`, null, {
                params: { active: !currentActive }
            });
            fetchTests();
        } catch (e) { alert('Failed to toggle test status.'); }
    };

    const handleDeleteTest = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
        try {
            await api.delete(`/v1/laboratory/tests/${id}`);
            fetchTests();
        } catch (e) { alert('Failed to delete test: ' + (e.response?.data?.message || e.message)); }
    };

    const handleUpdateStatus = async (reportId, status) => {
        try {
            let finalUrl = '';
            
            if (status === 'RESULT_READY') {
                if (!reportForm.notes.trim()) {
                    setPublishingError('Please provide technician findings/notes.');
                    return;
                }
                if (!reportForm.file) {
                    setPublishingError('Please upload the report file.');
                    return;
                }

                setPublishing(true);
                setPublishingError('');

                // 1. Upload the file first
                const formData = new FormData();
                formData.append('file', reportForm.file);
                const uploadRes = await api.post('/v1/uploads/lab-report', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalUrl = `/api/v1/uploads/lab-report/${uploadRes.data}`;
            }

            await api.patch(`/v1/lab-reports/${reportId}/status`, {}, {
                params: { 
                    status, 
                    notes: status === 'RESULT_READY' ? reportForm.notes : undefined, 
                    reportFileUrl: status === 'RESULT_READY' ? finalUrl : undefined 
                }
            });
            
            setUpdatingReport(null);
            setReportForm({ notes: '', file: null });
            setPublishingError('');
            fetchAll();
        } catch (e) { 
            const msg = e.response?.data?.message || e.message;
            if (status === 'RESULT_READY') setPublishingError('Publish failed: ' + msg);
            else alert('Failed to update: ' + msg); 
        } finally {
            setPublishing(false);
        }
    };

    const handleCloseSlot = async (slotId) => {
        if (!window.confirm('Close this slot? It will no longer accept new bookings.')) return;
        try {
            await api.patch(`/v1/lab-slots/${slotId}/close`);
            fetchAll();
        } catch (e) { alert('Failed to close slot.'); }
    };

    const handleReopenSlot = async (slotId) => {
        if (!window.confirm('Re-open this slot? Patients will be able to book it again.')) return;
        try {
            await api.patch(`/v1/lab-slots/${slotId}/reopen`);
            fetchAll();
        } catch (e) { alert('Failed to reopen slot.'); }
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    const openEditTest = (t) => {
        setEditingTest(t);
        setTestForm({
            name: t.name, description: t.description || '', price: t.price?.toString() || '',
            category: t.category || 'BIOCHEMISTRY', prepInstructions: t.prepInstructions || '',
            resourceRequired: t.resourceRequired || '', durationMinutes: t.durationMinutes?.toString() || '30',
            fastingRequired: t.fastingRequired || false
        });
        setShowTestModal(true);
    };

    const filteredReports = reports.filter(r => {
        const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || (r.patient?.firstName + ' ' + r.patient?.lastName).toLowerCase().includes(q)
            || r.labTest?.name?.toLowerCase().includes(q)
            || r.bookingReference?.toLowerCase().includes(q);
        return matchStatus && matchSearch;
    });

    const statCards = [
        { label: 'Pending Collection', value: reports.filter(r => ['REQUESTED', 'PAID'].includes(r.status)).length, color: '#60a5fa', icon: <QueueIcon /> },
        { label: 'In Processing', value: reports.filter(r => ['SAMPLE_COLLECTED', 'IN_LAB'].includes(r.status)).length, color: '#a78bfa', icon: <ProcessingIcon /> },
        { label: 'Results Ready', value: reports.filter(r => r.status === 'RESULT_READY').length, color: '#34d399', icon: <CatalogIcon /> },
        { label: 'Completed Today', value: reports.filter(r => r.status === 'COMPLETED' && new Date(r.updatedAt).toDateString() === new Date().toDateString()).length, color: '#00c6a7', icon: <CompletedIcon /> },
    ];

    return (
        <div className="dashboard-layout theme-workspace-light animate-in">
            {/* ── Sidebar ─────────────────────────────────────────────────────── */}
            <aside className="sidebar">
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="sidebar-logo">
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#CFF971', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F2819' }}>
                            <HeartIcon />
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>CareLink</div>
                            <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>Laboratory Portal</div>
                        </div>
                    </div>
                </Link>

                <nav className="sidebar-nav">
                    <div className="section-title">Laboratory</div>
                    {[
                        { id: 'queue', label: 'Test Queue', icon: <QueueIcon />, badge: reports.filter(r => ['REQUESTED', 'PAID'].includes(r.status)).length },
                        { id: 'processing', label: 'In Processing', icon: <ProcessingIcon />, badge: reports.filter(r => ['SAMPLE_COLLECTED', 'IN_LAB'].includes(r.status)).length },
                        { id: 'completed', label: 'Completed', icon: <CompletedIcon /> },
                        { id: 'slots', label: 'Slot Management', icon: <CalendarIcon /> },
                        { id: 'catalog', label: 'Test Catalog', icon: <CatalogIcon /> },
                        { id: 'analytics', label: 'Reports & Analytics', icon: <ChartBarIcon /> },
                    ].map(item => (
                        <button key={item.id} onClick={() => { setActiveTab(item.id); if (item.id === 'catalog') fetchTests(); }}
                            className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}>
                            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                            <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                            {item.badge > 0 && (
                                <span style={{ background: '#ef4444', color: '#fff', borderRadius: '9999px', fontSize: '0.65rem', padding: '2px 7px', fontWeight: 700 }}>{item.badge}</span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-nav" style={{ flex: 'none', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <button className="sidebar-link" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
                        <LogOutIcon /> Sign Out
                    </button>
                </div>
            </aside>

            {/* ── Main Content ─────────────────────────────────────────────────── */}
            <main className="main-content" style={{ minWidth: 0 }}>
                {/* Header */}
                <header className="topbar">
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {activeTab === 'queue' ? '🧪 Test Order Queue' :
                                activeTab === 'processing' ? '🔬 In Processing' :
                                    activeTab === 'completed' ? '✅ Completed Tests' :
                                        activeTab === 'slots' ? '📅 Slot Management' : 
                                            activeTab === 'analytics' ? '📊 Reports & Analytics' : '📋 Test Catalog'}
                        </h1>
                        <div style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#6B7280', fontWeight: 600 }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <NotificationBell light />
                        <div 
                            onClick={() => setEditModalOpen(true)}
                            title="Update Profile"
                            style={{ 
                                width: '40px', height: '40px', borderRadius: '50%', 
                                background: 'rgba(207, 249, 113, 0.1)', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                color: '#0F2819', fontSize: '1.2rem', fontWeight: 800,
                                overflow: 'hidden', border: '1.5px solid rgba(15, 40, 25, 0.2)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                cursor: 'pointer'
                            }}
                        >
                            {user?.profilePicturePath ? (
                                <img 
                                    src={`/api/v1/uploads/profile-picture/${user.profilePicturePath}`} 
                                    alt="Profile" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                            ) : (
                                user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'L'
                            )}
                        </div>
                    </div>
                </header>

                <div className="page-content">

                    {/* ── QUEUE / PROCESSING / COMPLETED TABS ───────────────────── */}
                    {['queue', 'processing', 'completed'].includes(activeTab) && (
                        <>
                            {/* Stat Cards */}
                            <div className="stat-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '0.8rem', marginBottom: '2rem' }}>
                                {statCards.map((s, i) => (
                                    <div key={i} className="stat-card" style={{ background: '#FFFFFF', border: '1px solid #CFF971', borderRadius: '12px', padding: '0.9rem 0.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'transform 0.2s', width: '100%' }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{s.icon}</div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div className="stat-card-value" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>{s.value}</div>
                                            <div className="stat-card-label" style={{ fontSize: '0.68rem', color: '#4B5563', fontWeight: 700, marginTop: '2px' }}>{s.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Filters */}
                            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                <input
                                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="🔍 Search patient, test or reference..."
                                    style={{ flex: 1, minWidth: '220px', padding: '0.6rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.875rem' }}
                                />
                                {['ALL', 'REQUESTED', 'PAID', 'SAMPLE_COLLECTED', 'IN_LAB', 'RESULT_READY', 'COMPLETED'].map(s => (
                                    <button key={s} onClick={() => setFilterStatus(s)}
                                        style={{
                                            padding: '0.55rem 1.2rem', borderRadius: '9999px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem',
                                            background: filterStatus === s ? '#0F2819' : 'transparent',
                                            color: filterStatus === s ? '#CFF971' : '#6B7280',
                                            border: `1px solid ${filterStatus === s ? '#0F2819' : '#E5E7EB'}`,
                                            transition: 'all 0.2s'
                                        }}>
                                        {s === 'ALL' ? 'All' : STATUS[s]?.label || s}
                                    </button>
                                ))}
                            </div>

                            {/* Reports Table */}
                            <div style={{ background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                                {loading ? (
                                    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
                                ) : filteredReports.length === 0 ? (
                                    <div style={{ padding: '5rem', textAlign: 'center' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>🧫</div>
                                        <div style={{ color: 'var(--text-secondary)' }}>No test orders found.</div>
                                    </div>
                                ) : (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                                                    {['Patient', 'Reference', 'Test Ordered', 'Scheduled Time', 'Status', 'Progress', 'Actions'].map(h => (
                                                        <th key={h} style={{ padding: '0.9rem 1.2rem', textAlign: 'left', fontSize: '0.73rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredReports
                                                    .filter(r => {
                                                        if (activeTab === 'queue') return ['REQUESTED', 'PAID'].includes(r.status);
                                                        if (activeTab === 'processing') return ['SAMPLE_COLLECTED', 'IN_LAB', 'RESULT_READY'].includes(r.status);
                                                        if (activeTab === 'completed') return ['COMPLETED', 'CANCELLED'].includes(r.status);
                                                        return true;
                                                    })
                                                    .map((report, i) => {
                                                        const s = STATUS[report.status] || STATUS.REQUESTED;
                                                        const nextStatus = NEXT_STATUS[report.status];
                                                        const needsUpload = report.status === 'IN_LAB';
                                                        return (
                                                            <tr key={report.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                                <td style={{ padding: '1rem 1.2rem' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #0f766e, #00c6a7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '0.9rem', flexShrink: 0 }}>
                                                                            {report.patient?.firstName?.charAt(0)}
                                                                        </div>
                                                                        <div>
                                                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{report.patient?.firstName} {report.patient?.lastName}</div>
                                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{report.patient?.email}</div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td style={{ padding: '1rem 1.2rem' }}>
                                                                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: 'rgba(0,0,0,0.04)', padding: '0.2rem 0.6rem', borderRadius: '6px', color: 'var(--text-secondary)' }}>{report.bookingReference}</span>
                                                                </td>
                                                                <td style={{ padding: '1rem 1.2rem' }}>
                                                                    <div style={{ fontWeight: 500, fontSize: '0.88rem' }}>{report.labTest?.name}</div>
                                                                    {report.labTest?.category && (
                                                                        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600, color: CAT_COLOR[report.labTest.category] || '#888', background: (CAT_COLOR[report.labTest.category] || '#888') + '20' }}>
                                                                            {report.labTest.category}
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td style={{ padding: '1rem 1.2rem', fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                                                    {new Date(report.labSlot?.testTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                                                                </td>
                                                                <td style={{ padding: '1rem 1.2rem', whiteSpace: 'nowrap' }}>
                                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 600, background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
                                                                        {s.icon} {s.label}
                                                                    </span>
                                                                </td>
                                                                <td style={{ padding: '1rem 1.2rem' }}>
                                                                    <div style={{ display: 'flex', gap: '4px' }}>
                                                                        {['REQUESTED', 'SAMPLE_COLLECTED', 'IN_LAB', 'RESULT_READY', 'COMPLETED'].map(st => (
                                                                            <div key={st} style={{ width: '24px', height: '6px', borderRadius: '3px', background: (STATUS[report.status]?.step ?? -1) >= STATUS[st].step ? STATUS[st].color : 'rgba(0,0,0,0.06)' }} />
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                                <td style={{ padding: '1rem 1.2rem' }}>
                                                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'nowrap' }}>
                                                                        {nextStatus && (
                                                                            <button
                                                                                onClick={() => {
                                                                                    if (needsUpload) {
                                                                                        setUpdatingReport(report);
                                                                                        setReportForm({ notes: '', file: null });
                                                                                        setPublishingError('');
                                                                                    } else {
                                                                                        handleUpdateStatus(report.id, nextStatus);
                                                                                    }
                                                                                }}
                                                                                style={{ padding: '0.4rem 0.8rem', background: '#CFF971', color: '#0F2819', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, fontSize: '0.72rem', whiteSpace: 'nowrap', boxShadow: '0 2px 5px rgba(207, 249, 113, 0.4)' }}>
                                                                                {NEXT_LABEL[report.status]}
                                                                            </button>
                                                                        )}
                                                                        {(['RESULT_READY', 'COMPLETED'].includes(report.status)) && report.reportFileUrl && (
                                                                            <a href={report.reportFileUrl} target="_blank" rel="noopener noreferrer"
                                                                                style={{ padding: '0.45rem 0.9rem', background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
                                                                                📂 View Report
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* ── SLOT MANAGEMENT TAB ────────────────────────────────────── */}
                    {activeTab === 'slots' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '600px' }}>
                                    Manage your lab availability. Each slot has a capacity — multiple patients can book the same time window.
                                </div>
                                <button onClick={() => setShowSlotModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: '#0F2819', color: '#CFF971', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(15, 40, 25, 0.15)', flexShrink: 0 }}>
                                    <PlusIcon /> Add Time Slot
                                </button>
                            </div>
                            {slots.length === 0 ? (
                                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '5rem', textAlign: 'center' }}>
                                    <div style={{ fontSize: '3rem', opacity: 0.4, marginBottom: '1rem' }}>📅</div>
                                    <div style={{ color: 'var(--text-secondary)' }}>No upcoming slots. Click "Add Time Slot" to create availability.</div>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                                    {slots.map(slot => {
                                        const pct = slot.capacity > 0 ? (slot.bookedCount / slot.capacity) * 100 : 0;
                                        const full = slot.bookedCount >= slot.capacity || slot.closed;
                                        return (
                                            <div key={slot.id} style={{ background: 'var(--bg-card)', borderRadius: '16px', border: `1px solid ${full ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`, padding: '1.25rem', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column' }}
                                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                    <div>
                                                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827' }}>
                                                            {new Date(slot.testTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </div>
                                                        <div style={{ color: '#3b82f6', fontWeight: 700, fontSize: '1.15rem', whiteSpace: 'nowrap' }}>
                                                            {new Date(slot.testTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                            {slot.endTime && ` - ${new Date(slot.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`}
                                                        </div>
                                                    </div>
                                                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, background: full ? 'rgba(239,68,68,0.12)' : 'rgba(52,211,153,0.12)', color: full ? '#f87171' : '#10b981' }}>
                                                        {full ? (slot.closed ? '🔒 Closed' : '🔴 Full') : '🟢 Open'}
                                                    </span>
                                                </div>
                                                <div style={{ marginBottom: '1rem', flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                                                        <span>Capacity</span>
                                                        <span style={{ fontWeight: 600 }}>{slot.bookedCount}/{slot.capacity} booked</span>
                                                    </div>
                                                    <div style={{ height: '6px', background: 'rgba(0,0,0,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                                                        <div style={{ height: '100%', width: `${pct}%`, background: pct >= 100 ? '#f87171' : pct >= 70 ? '#fbbf24' : '#10b981', borderRadius: '3px', transition: 'width 0.3s' }} />
                                                    </div>
                                                </div>
                                                {slot.closed ? (
                                                    <button onClick={() => handleReopenSlot(slot.id)} style={{ width: '100%', padding: '0.45rem', background: 'rgba(59,130,246,0.08)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                                                        🔓 Re-open Slot
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleCloseSlot(slot.id)} style={{ width: '100%', padding: '0.45rem', background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                                                        🔒 Close Slot
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── TEST CATALOG TAB ───────────────────────────────────────── */}
                    {activeTab === 'catalog' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '600px' }}>
                                    Manage the complete inventory of laboratory tests available for ordering.
                                </div>
                                <button onClick={() => { setEditingTest(null); setTestForm({ name: '', description: '', price: '', category: 'BIOCHEMISTRY', prepInstructions: '', resourceRequired: '', durationMinutes: '30', fastingRequired: false }); setShowTestModal(true); }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: '#0F2819', color: '#CFF971', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(15, 40, 25, 0.15)', flexShrink: 0 }}>
                                    <PlusIcon /> Add Test
                                </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                                {tests.map(test => (
                                <div key={test.id} style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', opacity: test.active ? 1 : 0.5, transition: 'transform 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                    <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <div>
                                                {test.category && (
                                                    <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700, color: CAT_COLOR[test.category] || '#888', background: (CAT_COLOR[test.category] || '#888') + '20', marginBottom: '0.4rem', display: 'inline-block', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                                        {test.category}
                                                    </span>
                                                )}
                                                <h4 style={{ margin: '0.25rem 0 0', fontSize: '1rem', fontWeight: 700 }}>{test.name}</h4>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                <button onClick={() => handleToggleTest(test.id, test.active)}
                                                    title={test.active ? "Deactivate Test" : "Activate Test"}
                                                    style={{ background: test.active ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.35rem', cursor: 'pointer', color: test.active ? '#34d399' : '#f87171' }}>
                                                    {test.active ? '👁️' : '🕶️'}
                                                </button>
                                                <button onClick={() => openEditTest(test)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.35rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                                    <EditIcon />
                                                </button>
                                                <button onClick={() => handleDeleteTest(test.id, test.name)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.35rem', cursor: 'pointer', color: '#f87171' }}>
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{test.description}</p>
                                    </div>
                                    <div style={{ padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.82rem' }}>
                                        <div><div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '2px' }}>Price</div><div style={{ fontWeight: 700, color: 'var(--primary)' }}>LKR {test.price?.toLocaleString()}</div></div>
                                        <div><div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '2px' }}>Duration</div><div style={{ fontWeight: 600 }}>~{test.durationMinutes} min</div></div>
                                        <div><div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '2px' }}>Resource</div><div>{test.resourceRequired || '—'}</div></div>
                                        <div><div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '2px' }}>Fasting</div>
                                            <span style={{ fontWeight: 600, color: test.fastingRequired ? '#fbbf24' : '#34d399' }}>{test.fastingRequired ? '⚠️ Required' : '✅ Not needed'}</span>
                                        </div>
                                    </div>
                                    {test.prepInstructions && (
                                        <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                            📋 <em>{test.prepInstructions}</em>
                                        </div>
                                    )}
                                </div>
                            ))}
                            </div>
                        </div>
                    )}

                    {/* ── ANALYTICS TAB ────────────────────────────────────────── */}
                    {activeTab === 'analytics' && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.8rem' }}>
                                <div style={{ padding: '10px', background: '#F3F4F6', borderRadius: '12px', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChartBarIcon /></div>
                                <h3 style={{ margin: 0, color: '#111827', fontSize: '1.25rem', fontWeight: 800 }}>Laboratory Analytics</h3>
                            </div>
                            <AnalyticsView reports={reports} />
                        </div>
                    )}
                </div>
            </main>

            {/* ── Modals Theme Overrides ────────────────────────────────────────── */}
            <style>{`
                .white-modal .form-label { color: #374151 !important; font-weight: 600 !important; font-size: 0.85rem !important; }
                .white-modal .form-input { background: #F9FAFB !important; border: 1px solid #E5E7EB !important; color: #111827 !important; transition: all 0.2s; }
                .white-modal .form-input.error { border-color: #ef4444 !important; background: #fffafb !important; }
                .white-modal .form-input:focus { border-color: #0F2819 !important; box-shadow: 0 0 0 3px rgba(15, 40, 25, 0.1) !important; outline: none; }
                .white-modal .form-input.error:focus { border-color: #ef4444 !important; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important; }
                .white-modal .btn-outline { border: 1px solid #E5E7EB !important; color: #374151 !important; background: transparent !important; cursor: pointer; }
                .white-modal .btn-outline:hover { background: #F3F4F6 !important; }
            `}</style>

            {/* ── Add Slot Modal ────────────────────────────────────────────────── */}
            {showSlotModal && (
                <div onClick={() => setShowSlotModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(17, 24, 39, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div onClick={e => e.stopPropagation()} className="white-modal" style={{ background: '#FFFFFF', border: '0', borderRadius: '24px', padding: '2.5rem', width: '420px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'animate-in 0.2s ease' }}>
                        <h3 style={{ margin: '0 0 0.5rem', color: '#111827', fontWeight: 800, fontSize: '1.4rem' }}>📅 Add Availability Slot</h3>
                        <p style={{ margin: '0 0 1.5rem', fontSize: '0.85rem', color: '#4B5563', lineHeight: 1.5 }}>Set a time when lab services are available. You can allow multiple patients per slot.</p>
                        <form onSubmit={handleCreateSlot} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input type="date" className="form-input" required min={new Date().toISOString().split('T')[0]}
                                    value={slotForm.date} onChange={e => setSlotForm({ ...slotForm, date: e.target.value })} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Start Time</label>
                                    <input type="time" className="form-input" required
                                        value={slotForm.time} onChange={e => setSlotForm({ ...slotForm, time: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">End Time</label>
                                    <input type="time" className="form-input" required
                                        value={slotForm.endTime} onChange={e => setSlotForm({ ...slotForm, endTime: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ color: '#374151', fontWeight: 600, fontSize: '0.85rem' }}>Patient Capacity (concurrent bookings)</label>
                                <input type="number" className="form-input" min="1" max="50" required
                                    style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#111827' }}
                                    value={slotForm.capacity} onChange={e => setSlotForm({ ...slotForm, capacity: e.target.value })} />
                                <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.35rem' }}>E.g. set 5 to allow 5 patients to book the same 30-minute window (e.g. for blood draws).</div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowSlotModal(false)} className="btn btn-outline" style={{ flex: 1, borderRadius: '12px', height: '48px' }}>Cancel</button>
                                <button type="submit" style={{ flex: 2, borderRadius: '12px', height: '48px', background: '#0F2819', color: '#CFF971', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.95rem' }}>Create Slot</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Add/Edit Test Modal ───────────────────────────────────────────── */}
            {showTestModal && (
                <div onClick={() => { setShowTestModal(false); setEditingTest(null); }} style={{ position: 'fixed', inset: 0, background: 'rgba(17, 24, 39, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
                    <div onClick={e => e.stopPropagation()} className="white-modal" style={{ background: '#FFFFFF', border: '0', borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <h3 style={{ margin: '0 0 1.5rem', color: '#111827', fontWeight: 800, fontSize: '1.4rem' }}>{editingTest ? '✏️ Edit Test' : '➕ Add New Test'}</h3>
                        <form onSubmit={handleSaveTest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Test Name *</label>
                                    <input className={`form-input ${formErrors.name ? 'error' : ''}`} placeholder="e.g. Full Blood Count" value={testForm.name} onChange={e => { setTestForm({ ...testForm, name: e.target.value }); if(formErrors.name) setFormErrors({...formErrors, name:null}); }} />
                                    {formErrors.name && <div style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '0.3rem', fontWeight: 600 }}>{formErrors.name}</div>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Category *</label>
                                    <select className={`form-input ${formErrors.category ? 'error' : ''}`} value={testForm.category} onChange={e => { setTestForm({ ...testForm, category: e.target.value }); if(formErrors.category) setFormErrors({...formErrors, category:null}); }}>
                                        {['HAEMATOLOGY', 'BIOCHEMISTRY', 'MICROBIOLOGY', 'RADIOLOGY', 'ENDOCRINOLOGY', 'SEROLOGY'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    {formErrors.category && <div style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '0.3rem', fontWeight: 600 }}>{formErrors.category}</div>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Price (LKR) *</label>
                                    <input type="number" className={`form-input ${formErrors.price ? 'error' : ''}`} min="0" placeholder="e.g. 1500" value={testForm.price} onChange={e => { setTestForm({ ...testForm, price: e.target.value }); if(formErrors.price) setFormErrors({...formErrors, price:null}); }} />
                                    {formErrors.price && <div style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '0.3rem', fontWeight: 600 }}>{formErrors.price}</div>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Resource Required</label>
                                    <input className="form-input" placeholder="e.g. Phlebotomist, MRI Room" value={testForm.resourceRequired} onChange={e => setTestForm({ ...testForm, resourceRequired: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Duration (minutes)</label>
                                    <input type="number" className={`form-input ${formErrors.durationMinutes ? 'error' : ''}`} min="5" max="480" value={testForm.durationMinutes} onChange={e => { setTestForm({ ...testForm, durationMinutes: e.target.value }); if(formErrors.durationMinutes) setFormErrors({...formErrors, durationMinutes:null}); }} />
                                    {formErrors.durationMinutes && <div style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '0.3rem', fontWeight: 600 }}>{formErrors.durationMinutes}</div>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description *</label>
                                <textarea className={`form-input ${formErrors.description ? 'error' : ''}`} rows="2" placeholder="Describe what this test measures..." value={testForm.description} onChange={e => { setTestForm({ ...testForm, description: e.target.value }); if(formErrors.description) setFormErrors({...formErrors, description:null}); }} style={{ resize: 'vertical' }} />
                                {formErrors.description && <div style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '0.3rem', fontWeight: 600 }}>{formErrors.description}</div>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Preparation Instructions</label>
                                <textarea className="form-input" rows="2" placeholder="e.g. Fast for 12 hours, remove all metal objects..." value={testForm.prepInstructions} onChange={e => setTestForm({ ...testForm, prepInstructions: e.target.value })} style={{ resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem', background: 'rgba(251,191,36,0.06)', borderRadius: '10px', border: '1px solid rgba(251,191,36,0.2)', cursor: 'pointer' }} onClick={() => setTestForm({ ...testForm, fastingRequired: !testForm.fastingRequired })}>
                                <input type="checkbox" id="fasting" checked={testForm.fastingRequired} onChange={e => setTestForm({ ...testForm, fastingRequired: e.target.checked })} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                                <label htmlFor="fasting" style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: testForm.fastingRequired ? '#d97706' : '#4B5563' }}>
                                    ⚠️ Fasting Required (will show mandatory instruction popup to patient)
                                </label>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => { setShowTestModal(false); setEditingTest(null); setFormErrors({}); }} className="btn btn-outline" style={{ flex: 1, borderRadius: '12px', height: '48px' }}>Cancel</button>
                                <button type="submit" disabled={testSaving} style={{ flex: 2, borderRadius: '12px', height: '48px', background: '#0F2819', color: '#CFF971', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.95rem' }}>
                                    {testSaving ? 'Saving...' : (editingTest ? '💾 Save Changes' : '➕ Add to Catalog')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Upload Results Modal ──────────────────────────────────────────── */}
            {updatingReport && (
                <div onClick={() => setUpdatingReport(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div onClick={e => e.stopPropagation()} className="white-modal" style={{ background: '#FFFFFF', border: '0', borderRadius: '24px', padding: '0', width: '500px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)' }}>
                        <div style={{ background: '#CFF971', padding: '1.75rem 2rem', position: 'relative' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(15, 40, 25, 0.55)', marginBottom: '0.4rem' }}>Upload Result</div>
                            <h3 style={{ margin: 0, color: '#0F2819', fontSize: '1.2rem', fontWeight: 800 }}>{updatingReport.labTest?.name}</h3>
                            <p style={{ margin: '0.2rem 0 0', color: 'rgba(15, 40, 25, 0.75)', fontSize: '0.85rem', fontWeight: 600 }}>
                                {updatingReport.patient?.firstName} {updatingReport.patient?.lastName} · {updatingReport.bookingReference}
                            </p>
                            <button type="button" onClick={() => setUpdatingReport(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(15, 40, 25, 0.08)', border: 'none', color: '#0F2819', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>✕</button>
                        </div>
                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {publishingError && (
                                <div style={{ padding: '0.8rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#ef4444', fontSize: '0.82rem', fontWeight: 600 }}>
                                    ⚠️ {publishingError}
                                </div>
                            )}
                            <div className="form-group">
                                <label className="form-label">Technician Findings & Clinical Notes *</label>
                                <textarea className="form-input" rows="4" placeholder="Document any relevant findings, values, or observations..."
                                    value={reportForm.notes} onChange={e => { setReportForm({ ...reportForm, notes: e.target.value }); setPublishingError(''); }} style={{ resize: 'vertical' }} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">📎 Upload Report File (PDF/Word/Image) *</label>
                                <input type="file" accept=".pdf,.doc,.docx,image/*" className="form-input" style={{ padding: '0.6rem' }} onChange={e => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setReportForm({ ...reportForm, file: e.target.files[0] });
                                        setPublishingError('');
                                    }
                                }} />
                                <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.35rem' }}>Patient will be notified and can download this file from their dashboard.</div>
                            </div>
                            <div style={{ padding: '1rem', background: 'rgba(207, 249, 113, 0.1)', borderRadius: '12px', border: '1px solid rgba(207, 249, 113, 0.4)', fontSize: '0.85rem', color: '#0F2819', fontWeight: 500 }}>
                                ✅ Submitting will move the status to <strong style={{ fontWeight: 800 }}>Result Ready</strong> and automatically notify the patient.
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <button disabled={publishing} onClick={() => setUpdatingReport(null)} className="btn btn-outline" style={{ flex: 1, borderRadius: '12px', height: '50px' }}>Cancel</button>
                                <button disabled={publishing} onClick={() => handleUpdateStatus(updatingReport.id, 'RESULT_READY')} style={{ flex: 2, borderRadius: '12px', height: '50px', background: '#0F2819', color: '#CFF971', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    {publishing ? <div className="spinner" style={{ width: '18px', height: '18px', border: '2px solid #CFF971', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div> : <UploadIcon />}
                                    {publishing ? 'Publishing...' : 'Publish Results'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Profile Update Modal ────────────────────────────────────────── */}
            {editModalOpen && (
                <div className="modal-overlay" onClick={() => setEditModalOpen(false)} style={{ zIndex: 9999 }}>
                    <div className="modal-content animate-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px', width: '100%', padding: 0, background: '#ffffff', color: '#111827', borderRadius: '24px', overflow: 'hidden', border: '1px solid #E5E7EB', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

                        {/* Modal Hero Header */}
                        <div style={{ background: '#CFF971', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.8rem 2rem 1.4rem', position: 'relative', flexShrink: 0 }}>
                            <button type="button" className="btn btn-ghost" onClick={() => setEditModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#111827', fontSize: '1.1rem', padding: '4px 8px' }}>✕</button>
                            
                            <ProfilePictureUpload 
                                image={profileImg} 
                                currentImage={user?.profilePicturePath}
                                onChange={setProfileImg} 
                            />

                            <h2 style={{ color: '#111827', margin: 0, fontSize: '1.2rem', fontWeight: 800, textAlign: 'center' }}>Update Professional Profile</h2>
                            <p style={{ color: '#4b5563', fontSize: '0.82rem', margin: '0.25rem 0 0', fontWeight: 500, textAlign: 'center' }}>{user?.email}</p>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSaveProfile} style={{ padding: '1.6rem 2rem 2rem', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><span>📞</span><span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: '#6B7280', textTransform: 'uppercase' }}>Contact Information</span></div>
                            <div className="form-group">
                                <label className="form-label" style={{ color: '#4B5563', fontWeight: 600 }}>Phone Number</label>
                                <input type="tel" className="form-input" placeholder="+94 77 123 4567" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#111827' }} />
                            </div>
                            
                            <div className="form-group" style={{ background: 'rgba(207, 249, 113, 0.05)', padding: '1rem', borderRadius: '14px', border: '1.5px solid rgba(207, 249, 113, 0.2)', marginTop: '1.2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, color: '#0F2819', fontSize: '0.9rem' }}>Two-Step Verification</div>
                                        <div style={{ fontSize: '0.74rem', color: '#6B7280', marginTop: '0.1rem' }}>Secure your accounts with an OTP.</div>
                                    </div>
                                    <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={editForm.twoFactorEnabled} 
                                            onChange={e => setEditForm({...editForm, twoFactorEnabled: e.target.checked})}
                                            style={{ opacity: 0, width: 0, height: 0 }}
                                        />
                                        <span style={{ 
                                            position: 'absolute', cursor: 'pointer', inset: 0, background: editForm.twoFactorEnabled ? '#CFF971' : '#ccc', 
                                            transition: '.4s', borderRadius: '24px' 
                                        }}>
                                            <span style={{ 
                                                position: 'absolute', content: '""', height: '18px', width: '18px', left: editForm.twoFactorEnabled ? '23px' : '3px', bottom: '3px', 
                                                background: 'white', transition: '.4s', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }} />
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.8rem' }}>
                                <button type="button" onClick={() => setEditModalOpen(false)} style={{ flex: 1, borderRadius: '12px', height: '48px', fontWeight: 700, fontSize: '0.95rem', background: '#FFFFFF', border: '1.5px solid #D1D5DB', color: '#374151', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={saving} style={{ flex: 1.5, borderRadius: '12px', background: '#0F2819', color: '#CFF971', height: '48px', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save Changes'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
