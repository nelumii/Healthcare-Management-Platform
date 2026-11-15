import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import NotificationBell from '../components/NotificationBell';
import DiseasePredictor from '../components/DiseasePredictor';

const API = '/api';

// ── Icons ────────────────────────────────────────────────────────────────────
function HeartIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}
function ShieldIcon() {
    return <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)', marginBottom: '1rem' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
}
function ActivityIcon() {
    return <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)', marginBottom: '1rem' }}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
}
function UsersIcon() {
    return <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--warning)', marginBottom: '1rem' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
}
function LogInIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}
function StarIcon({ filled, onClick, style }) {
    return (
        <svg
            onClick={onClick}
            width="20" height="20" viewBox="0 0 24 24"
            fill={filled ? "#CFF971" : "none"}
            stroke={filled ? "#CFF971" : "rgba(255,255,255,0.4)"}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}

function FlaskIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3v15.82a2 2 0 0 0 1.11 1.79l.89.44a2 2 0 0 0 1.79 0l.89-.44A2 2 0 0 0 15 18.82V3" />
            <path d="M7 3h10" />
            <path d="M9 11h6" />
        </svg>
    );
}

// ── Booking Wizard ─────────────────────────────────────────────────────────
const SPECIALTIES = [
    'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist',
    'Orthopedic Specialist', 'Pediatrician', 'Gastroenterologist', 'Endocrinologist',
    'Pulmonologist', 'Rheumatologist', 'ENT Specialist', 'Urologist',
    'Infectious Disease Specialist', 'Hepatologist', 'Allergist / Immunologist',
    'Psychiatrist', 'Gynecologist', 'Oncologist', 'Radiologist',
    'Anesthesiologist', 'Nephrologist', 'Ophthalmologist',
    'Proctologist / General Surgeon', 'Vascular Surgeon', 'Other'
];

// Fetch unique specialties from registered doctors and merge with standard list
function useSpecialties() {
    const [specialties, setSpecialties] = React.useState(SPECIALTIES);
    React.useEffect(() => {
        axios.get(`${API}/v1/schedules/doctors`)
            .then(r => {
                const uniqueFromDb = [...new Set(
                    r.data.map(d => d.specialization).filter(Boolean)
                )];
                // Merge and remove duplicates, then sort
                const combined = [...new Set([...SPECIALTIES, ...uniqueFromDb])].sort();
                setSpecialties(combined);
            })
            .catch(() => setSpecialties(SPECIALTIES));
    }, []);
    return specialties;
}

function StepIndicator({ current }) {
    const steps = ['Doctor & Specialty', 'Date & Time', 'Visit Details', 'Summary'];
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: '2rem' }}>
            {steps.map((s, i) => (
                <React.Fragment key={i}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: i < current ? 'var(--primary)' : i === current ? 'var(--primary)' : 'var(--bg-input)',
                            border: `2px solid ${i <= current ? 'var(--primary)' : 'var(--border)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: i <= current ? '#fff' : 'var(--text-muted)',
                            fontWeight: 700, fontSize: '0.85rem',
                            transition: 'all 0.3s',
                        }}>
                            {i < current ? '✓' : i + 1}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: i === current ? 'var(--primary)' : 'var(--text-muted)', fontWeight: i === current ? 700 : 400, whiteSpace: 'nowrap' }}>{s}</span>
                    </div>
                    {i < steps.length - 1 && (
                        <div style={{ width: '60px', height: '2px', background: i < current ? 'var(--primary)' : 'var(--border)', margin: '0 4px', marginBottom: '1.2rem', transition: 'background 0.3s' }} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

function BookingWizard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const specialties = useSpecialties();
    const [step, setStep] = useState(0);
    const [doctors, setDoctors] = useState([]);
    const [slots, setSlots] = useState([]);
    const [slotFee, setSlotFee] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [bookedApptId, setBookedApptId] = useState(null);
    const [error, setError] = useState('');

    const [showSpecDropdown, setShowSpecDropdown] = useState(false);
    const [specQuery, setSpecQuery] = useState('');
    const restoredRef = React.useRef(false); 
    const specDropdownRef = useRef(null);
    const specInputRef = useRef(null);


    const [form, setForm] = useState(() => {
        // Eagerly restore from sessionStorage if redirected back from login
        if (sessionStorage.getItem('cl_restore_booking') === '1') {
            try {
                const saved = JSON.parse(sessionStorage.getItem('cl_pending_booking') || 'null');
                if (saved) return saved.form;
            } catch (e) { /* ignore */ }
        }
        return {
            specialty: '', doctorId: '', doctorName: '', doctorSpec: '',
            slotDate: '', slotTime: '',
            bookingFor: 'MYSELF', dependentName: '',
            patientName: '', patientEmail: '', reason: '',
        };
    });

    // Clear bookedId if form changes (so retry creates new record for new slot)
    useEffect(() => {
        setBookedApptId(null);
    }, [form.doctorId, form.slotDate, form.slotTime]);

    // Restore slots/fee and jump to step 4 on mount (after login redirect)
    useEffect(() => {
        if (sessionStorage.getItem('cl_restore_booking') === '1') {
            try {
                const saved = JSON.parse(sessionStorage.getItem('cl_pending_booking') || 'null');
                if (saved) {
                    restoredRef.current = true;
                    setSlotFee(saved.slotFee);
                    setSlots(saved.slots || []);
                    setStep(3);
                    sessionStorage.removeItem('cl_restore_booking');

                    setTimeout(() => {
                        document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                }
            } catch (e) { /* ignore */ }
        }
    }, []);

    // Auto-fill name/email if logged in
    useEffect(() => {
        if (user && !form.patientName && !form.patientEmail) {
            setForm(prev => ({
                ...prev,
                patientName: `${user.firstName} ${user.lastName}`,
                patientEmail: user.email
            }));
        }
    }, [user]);

    // Fetch doctors when specialty changes
    useEffect(() => {
        if (!form.specialty) { setDoctors([]); return; }
        axios.get(`${API}/v1/schedules/doctors?specialty=${encodeURIComponent(form.specialty)}`)
            .then(r => setDoctors(r.data))
            .catch(() => setDoctors([]));
    }, [form.specialty]);

    // Fetch slots when doctor + date changes (skip on first render after restore)
    useEffect(() => {
        if (!form.doctorId || !form.slotDate) { if (!restoredRef.current) setSlots([]); return; }
        if (restoredRef.current) { restoredRef.current = false; return; } // skip first fetch after restore
        setLoading(true);
        axios.get(`${API}/v1/schedules/slots?doctorId=${form.doctorId}&date=${form.slotDate}`)
            .then(r => { setSlots(r.data.slots || []); setSlotFee(r.data.fee); })
            .catch(() => setSlots([]))
            .finally(() => setLoading(false));
    }, [form.doctorId, form.slotDate]);

    const selectDoctor = (doc) => {
        setForm(f => ({ ...f, doctorId: doc.id, doctorName: doc.name, doctorSpec: doc.specialization }));
    };

    // Outside click for Specialty Dropdown
    useEffect(() => {
        const handleClick = (e) => {
            if (specDropdownRef.current && !specDropdownRef.current.contains(e.target) &&
                specInputRef.current && !specInputRef.current.contains(e.target)) {
                setShowSpecDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const selectSpecialty = (s) => {
        setForm(f => ({ ...f, specialty: s, doctorId: '', doctorName: '', slotDate: '', slotTime: '' }));
        setSpecQuery('');
        setShowSpecDropdown(false);
    };

    const filteredSpecialties = specialties.filter(s => 
        s.toLowerCase().includes(specQuery.toLowerCase())
    );

    // Save form to sessionStorage and navigate
    const handleAuthRedirect = (path) => {
        if (form.specialty || form.doctorId) {
            sessionStorage.setItem('cl_pending_booking', JSON.stringify({ form, slotFee, slots }));
        }
        navigate(path);
    };

    const goToLogin = () => handleAuthRedirect('/login');

    const handleSubmit = async () => {
        if (loading) return;
        const isLoggedIn = !!localStorage.getItem('cl_token');
        if (!isLoggedIn) {
            sessionStorage.setItem('cl_pending_booking', JSON.stringify({ form, slotFee, slots }));
            navigate('/login');
            return;
        }
        setError('');
        setLoading(true);
        let apptId = bookedApptId;
        try {
            if (!apptId) {
                // Step 1: Book appointment (creates PENDING)
                const bookRes = await axios.post(`${API}/v1/appointments/book`, {
                    doctorId: form.doctorId,
                    slotDate: form.slotDate,
                    slotTime: form.slotTime,
                    patientName: user ? (user.firstName + ' ' + user.lastName) : form.patientName,
                    patientEmail: user ? user.email : form.patientEmail,
                    reason: form.reason,
                    bookingFor: form.bookingFor,
                    dependentName: form.dependentName,
                }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('cl_token')}` }
                });

                apptId = bookRes.data?.appointmentId || bookRes.data?.id;
                setBookedApptId(apptId);
                sessionStorage.removeItem('cl_pending_booking');
            }

            // Step 2: Generate PayHere hash then open payment popup
            const orderId = `APT-${apptId || Date.now()}-${Date.now()}`;
            const payAmount = slotFee && slotFee > 0 ? slotFee : 2000;

            const hashRes = await axios.post(`${API}/v1/appointments/payhere-hash`, {
                orderId, amount: payAmount, currency: 'LKR'
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('cl_token')}` }
            });
            const { merchantId, hash, amount: formattedAmount } = hashRes.data;

            // Load PayHere SDK if needed
            if (!window.payhere) {
                const script = document.createElement('script');
                script.src = 'https://www.payhere.lk/lib/payhere.js';
                await new Promise(resolve => { script.onload = resolve; document.body.appendChild(script); });
            }

            window.payhere.onCompleted = async function(orderId) {
                try {
                    if (apptId) await axios.patch(`${API}/v1/appointments/${apptId}/paid`, {}, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('cl_token')}` }
                    });
                } catch(e) { console.error(e); }
                setBookedApptId(apptId);
                setSubmitted(true);
            };
            window.payhere.onDismissed = function() {
                setError('Payment was cancelled. Your booking is NOT confirmed yet. Please try again.');
            };
            window.payhere.onError = function(error) {
                setError('An error occurred during payment: ' + error + '. Please try again.');
            };

            const patientFirstName = user ? user.firstName : (form.patientName.split(' ')[0] || 'Patient');
            const patientLastName = user ? user.lastName : (form.patientName.split(' ').slice(1).join(' ') || '');
            window.payhere.startPayment({
                sandbox: true,
                merchant_id: merchantId,
                return_url: 'http://localhost:3000/patient/dashboard',
                cancel_url: 'http://localhost:3000',
                notify_url: 'http://localhost:8080/api/v1/appointments/payhere-notify',
                order_id: orderId,
                items: `Appointment with ${form.doctorName}`,
                amount: formattedAmount,
                currency: 'LKR',
                hash,
                first_name: patientFirstName,
                last_name: patientLastName,
                email: user ? user.email : form.patientEmail || 'patient@carelink.lk',
                phone: user?.phone || '0770000000',
                address: 'No. 1, CareLink Street',
                city: 'Colombo',
                country: 'Sri Lanka'
            });

        } catch (e) {
            setError(e.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                <div style={{
                    width: '90px', height: '90px',
                    background: 'rgba(207,249,113,0.15)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 0 40px rgba(207,249,113,0.3)',
                    border: '1px solid rgba(207,249,113,0.4)'
                }}>
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#CFF971" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(207,249,113,0.8))' }}>
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9 12l2 2 4-4" strokeWidth="3" />
                    </svg>
                </div>
                <h3 style={{ fontSize: '1.7rem', marginBottom: '0.6rem', fontWeight: 800, color: '#fff' }}>Your Booking Confirmed! 🎉</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 0.5rem', lineHeight: 1.6 }}>
                    Your appointment with <strong style={{ color: '#CFF971' }}>{form.doctorName}</strong> on <strong>{form.slotDate} at {form.slotTime}</strong> is now <span style={{ color: '#10b981', fontWeight: 700 }}>Confirmed</span>.
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2rem' }}>A confirmation will be sent to {form.patientEmail || 'your email'}.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="btn btn-outline" style={{ margin: 0 }} onClick={() => {
                        setSubmitted(false); setStep(0); setShowAuthPrompt(false);
                        setForm({ specialty: '', doctorId: '', doctorName: '', doctorSpec: '', slotDate: '', slotTime: '', bookingFor: 'MYSELF', dependentName: '', patientName: '', patientEmail: '', reason: '' });
                    }}>
                        Book Another
                    </button>
                    {user && (
                        <button className="btn btn-primary" style={{ margin: 0 }} onClick={() => {
                            const path = user.role === 'PATIENT' ? '/patient/dashboard' : '/doctor/dashboard';
                            navigate(path);
                        }}>
                            Go to My Dashboard
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <StepIndicator current={step} />

            {/* ── STEP 1: Doctor & Specialty ── */}
            {step === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div className="form-group" style={{ position: 'relative' }}>
                        <label className="form-label" style={{ color: 'rgba(255,255,255,0.7)' }}>🏥 Specialty / Department</label>
                        
                        {/* Custom Dropdown Trigger / Search */}
                        <div style={{
                            display: 'flex', alignItems: 'center',
                            background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(207,249,113,0.2)',
                            borderRadius: '14px', padding: '0 1rem', gap: '0.6rem',
                            transition: 'border-color 0.2s',
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(207,249,113,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                ref={specInputRef}
                                type="text"
                                placeholder={form.specialty || "Search or select specialty..."}
                                value={specQuery}
                                onChange={e => {
                                    setSpecQuery(e.target.value);
                                    setShowSpecDropdown(true);
                                }}
                                onFocus={() => setShowSpecDropdown(true)}
                                style={{
                                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                                    color: (form.specialty || specQuery) ? '#CFF971' : '#fff', fontSize: '0.92rem', padding: '0.85rem 0',
                                    fontFamily: 'inherit',
                                }}
                                className="spec-input-placeholder"
                            />
                            { (specQuery || form.specialty) && (
                                <button onClick={() => { 
                                    setSpecQuery(''); 
                                    setForm(f => ({ ...f, specialty: '', doctorId: '', doctorName: '' })); 
                                    setShowSpecDropdown(false); 
                                }} style={{
                                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1, padding: '2px',
                                }}>✕</button>
                            )}
                        </div>

                        {/* Dropdown List */}
                        {showSpecDropdown && (
                            <div ref={specDropdownRef} style={{
                                position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                                background: 'rgba(10,30,20,0.97)', border: '1px solid rgba(207,249,113,0.25)',
                                borderRadius: '14px', 
                                overflowY: 'auto',
                                maxHeight: '280px',
                                zIndex: 1000,
                                boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgba(207,249,113,0.3) transparent'
                            }}>
                                {filteredSpecialties.length === 0 ? (
                                    <div style={{ padding: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                                        No specialties found
                                    </div>
                                ) : (
                                    filteredSpecialties.map((s, idx) => (
                                        <button
                                            key={s}
                                            onClick={() => selectSpecialty(s)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                width: '100%', padding: '0.75rem 1.1rem', border: 'none',
                                                background: form.specialty === s ? 'rgba(207,249,113,0.15)' : 'transparent',
                                                color: form.specialty === s ? '#CFF971' : 'rgba(255,255,255,0.85)',
                                                cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem',
                                                transition: 'all 0.15s', fontFamily: 'inherit',
                                                borderBottom: idx < filteredSpecialties.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(207,249,113,0.1)'; e.currentTarget.style.color = '#CFF971'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = form.specialty === s ? 'rgba(207,249,113,0.15)' : 'transparent'; e.currentTarget.style.color = form.specialty === s ? '#CFF971' : 'rgba(255,255,255,0.85)'; }}
                                        >
                                            <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>🩺</span>
                                            {s}
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {form.specialty && (
                        <div className="form-group">
                            <label className="form-label">👨‍⚕️ Select Doctor</label>
                            {doctors.length === 0 ? (
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '0.75rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius)' }}>
                                    No doctors available for this specialty yet.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    {doctors.map(doc => (
                                        <div key={doc.id} onClick={() => selectDoctor(doc)} style={{
                                            padding: '0.9rem 1.1rem', border: `2px solid ${form.doctorId === doc.id ? 'var(--primary)' : 'var(--border)'}`,
                                            borderRadius: 'var(--radius)', background: form.doctorId === doc.id ? 'rgba(0,198,167,0.08)' : 'var(--bg-input)',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                        }}>
                                            <div style={{ fontWeight: 600 }}>{doc.name}</div>
                                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                                                {doc.specialization}{doc.qualifications ? ` · ${doc.qualifications}` : ''}{doc.yearsOfExperience ? ` · ${doc.yearsOfExperience} yrs exp` : ''}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                        <button type="button" className="btn btn-primary" disabled={!form.doctorId} onClick={() => setStep(1)} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Next: Choose Date & Time
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* ── STEP 2: Date & Time ── */}
            {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div className="form-group">
                        <label className="form-label">📅 Preferred Date</label>
                        <input type="date" className="form-input"
                            min={new Date().toISOString().split('T')[0]}
                            value={form.slotDate}
                            onChange={e => setForm(f => ({ ...f, slotDate: e.target.value, slotTime: '' }))} />
                    </div>

                    {form.slotDate && (
                        <div className="form-group">
                            <label className="form-label">🕐 Available Time Slots</label>
                            {loading ? (
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading slots...</div>
                            ) : slots.length === 0 ? (
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '0.75rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius)' }}>
                                    No available slots for this date. Please choose another day.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {slots.map(slot => (
                                        <button key={slot} type="button" onClick={() => setForm(f => ({ ...f, slotTime: slot }))} style={{
                                            padding: '0.45rem 1rem', borderRadius: 'var(--radius)', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.15s',
                                            border: `2px solid ${form.slotTime === slot ? 'var(--primary)' : 'var(--border)'}`,
                                            background: form.slotTime === slot ? 'var(--primary)' : 'var(--bg-input)',
                                            color: form.slotTime === slot ? '#fff' : 'var(--text-primary)',
                                        }}>
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {slotFee !== null && slotFee > 0 && (
                                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    💰 Consultation fee: <strong style={{ color: 'var(--primary)' }}>LKR {slotFee}</strong>
                                </div>
                            )}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" className="btn btn-outline" onClick={() => setStep(0)} style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                            Back
                        </button>
                        <button type="button" className="btn btn-primary" disabled={!form.slotTime} onClick={() => setStep(2)} style={{ flex: 1, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            Next: Visit Details
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* ── STEP 3: Visit Details ── */}
            {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    <div className="form-group">
                        <label className="form-label">👤 Booking For</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {['MYSELF', 'DEPENDENT'].map(opt => (
                                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: form.bookingFor === opt ? 700 : 400 }}>
                                    <input type="radio" name="bookingFor" value={opt} checked={form.bookingFor === opt}
                                        onChange={e => setForm(f => ({ ...f, bookingFor: e.target.value }))} />
                                    {opt === 'MYSELF' ? '🙋 Myself' : '👪 Someone Else (Dependent / Child)'}
                                </label>
                            ))}
                        </div>
                    </div>

                    {form.bookingFor === 'DEPENDENT' && (
                        <div className="form-group">
                            <label className="form-label">Dependent's Full Name</label>
                            <input className="form-input" placeholder="e.g. Amal Perera (age 8)" value={form.dependentName}
                                onChange={e => setForm(f => ({ ...f, dependentName: e.target.value }))} />
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Your Full Name *</label>
                            <input className="form-input" placeholder="Kamal Silva" required value={form.patientName}
                                onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-input" placeholder="kamal@email.com" value={form.patientEmail}
                                onChange={e => setForm(f => ({ ...f, patientEmail: e.target.value }))} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">🩺 Reason for Visit / Symptoms</label>
                        <textarea className="form-input" rows={3} placeholder="Describe your symptoms or reason for the visit (e.g. Severe headache for 3 days)..."
                            value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                            style={{ resize: 'vertical' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <button type="button" className="btn btn-outline" onClick={() => setStep(1)} style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                            Back
                        </button>
                        <button type="button" className="btn btn-primary" disabled={!form.patientName} onClick={() => setStep(3)} style={{ flex: 1, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            Review Summary
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* ── STEP 4: Summary ── */}
            {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div style={{ padding: '1.4rem', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                        <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Booking Summary</h4>
                        {[
                            ['👨‍⚕️ Doctor', form.doctorName],
                            ['🏥 Specialty', form.doctorSpec],
                            ['📅 Date', form.slotDate],
                            ['🕐 Time', form.slotTime],
                            ['👤 Patient', form.patientName + (form.bookingFor === 'DEPENDENT' ? ` (for ${form.dependentName})` : '')],
                            ['🩺 Reason', form.reason || '—'],
                            ['💰 Fee', slotFee && slotFee > 0 ? `LKR ${slotFee}` : 'LKR 2,000'],
                        ].map(([label, value]) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem', gap: '1rem' }}>
                                <span style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>{label}</span>
                                <span style={{ fontWeight: 500, textAlign: 'right' }}>{value}</span>
                            </div>
                        ))}
                    </div>


                    {error && (
                        <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', color: '#ef4444', fontSize: '0.9rem' }}>
                            ❌ {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <button type="button" className="btn btn-outline" onClick={() => setStep(2)} style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                            Edit
                        </button>
                        <button type="button" className="btn btn-primary" disabled={loading} onClick={handleSubmit} style={{ flex: 1, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            {loading ? 'Booking...' : (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                    Confirm Appointment
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
            <style>{`
                .spec-input-placeholder::placeholder {
                    color: ${form.specialty ? '#CFF971' : 'rgba(255,255,255,0.45)'} !important;
                    opacity: 1;
                }
            `}</style>
        </div>
    );
}

function LabBookingWizard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [labTests, setLabTests] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [step, setStep] = useState(1); // 1: Select Test, 2: Prep, 3: Slot, 4: Confirm, 5: Success
    const [loading, setLoading] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [bookingResult, setBookingResult] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLabData = async () => {
            setLoading(true);
            try {
                const [testsRes, slotsRes] = await Promise.all([
                    axios.get(`${API}/v1/laboratory/tests`).catch(() => ({ data: [] })),
                    axios.get(`${API}/v1/lab-slots/available`).catch(() => ({ data: [] }))
                ]);

                let tests = testsRes.data;
                let slots = slotsRes.data;

                // ── MOCK DATA FALLBACK (Always provide if empty or failed) ────────
                if (!tests || tests.length === 0) {
                    tests = [
                        { id: 901, name: 'Full Blood Count (FBC)', description: 'Essential screening for anemia and infections.', price: 1250, fastingRequired: false, prepInstructions: 'No special preparation.' },
                        { id: 902, name: 'Lipid Profile', description: 'Assesses cardiovascular risk and cholesterol.', price: 2800, fastingRequired: true, prepInstructions: 'Fasting for 10-12 hours mandated.' },
                        { id: 903, name: 'HbA1c (Diabetes)', description: 'Long-term glycemic control monitoring.', price: 1850, fastingRequired: false, prepInstructions: 'No fasting needed.' },
                    ];
                }
                if (!slots || slots.length === 0) {
                    const today = new Date();
                    for (let i = 1; i <= 5; i++) {
                        const date = new Date();
                        date.setDate(today.getDate() + i);
                        const hours = ['09:00', '11:00', '15:00'];
                        hours.forEach((h, idx) => {
                            const [hh, mm] = h.split(':');
                            const slotTime = new Date(date);
                            slotTime.setHours(hh, mm, 0, 0);
                            slots.push({
                                id: 1000 + i * 10 + idx,
                                testTime: slotTime.toISOString(),
                                capacity: 10,
                                bookedCount: 0
                            });
                        });
                    }
                }
                // ────────────────────────────────────────────────────────────────

                setLabTests(tests);
                setAvailableSlots(slots);
            } catch (err) {
                console.error('Failed to fetch lab data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLabData();
    }, []);

    const slotsByDate = availableSlots.reduce((acc, s) => {
        const d = new Date(s.testTime).toDateString();
        if (!acc[d]) acc[d] = [];
        acc[d].push(s);
        return acc;
    }, {});
    const availableDates = Object.keys(slotsByDate);

    const handleConfirmBooking = async () => {
        const isLoggedIn = !!localStorage.getItem('cl_token');
        if (!isLoggedIn) {
            sessionStorage.setItem('cl_pending_lab_booking', JSON.stringify({ selectedTest, selectedSlot }));
            navigate('/login');
            return;
        }

        setLoading(true);
        setError('');
        try {
            // Step 1: Create booking record
            const res = await axios.post(`${API}/v1/laboratory/book`, {
                testId: selectedTest.id,
                slotId: selectedSlot.id
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('cl_token')}` }
            });
            const savedReport = res.data;
            const reportId = savedReport.id;

            // Step 2: PayHere Payment Logic
            const orderId = `LAB-${reportId}-${Date.now()}`;
            const payAmount = selectedTest.price || 1500;

            const hashRes = await axios.post(`${API}/v1/laboratory/payhere-hash`, {
                orderId, amount: payAmount, currency: 'LKR'
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('cl_token')}` }
            });
            const { merchantId, hash, amount: formattedAmount } = hashRes.data;

            // Load PayHere SDK
            if (!window.payhere) {
                const script = document.createElement('script');
                script.src = 'https://www.payhere.lk/lib/payhere.js';
                await new Promise(resolve => { script.onload = resolve; document.body.appendChild(script); });
            }

            window.payhere.onCompleted = async function() {
                try {
                    // Step 3: Mark as paid on backend
                    const paidRes = await axios.patch(`${API}/v1/laboratory/reports/${reportId}/paid`, {}, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('cl_token')}` }
                    });
                     setBookingResult(paidRes.data);
                     setStep(5); // Only NOW transition to success
                } catch(e) { 
                    console.error('Failed to mark as paid', e);
                    setError('Payment successful, but we had trouble updating your record. Please contact support.');
                } finally {
                    setLoading(false);
                }
            };

            window.payhere.onDismissed = function() {
                // Cleanup asynchronously - record is not valid without payment
                axios.delete(`${API}/v1/laboratory/reports/${reportId}/cancel`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('cl_token')}` }
                }).catch(e => console.error('Cleanup failed', e));
                
                setError('Payment was cancelled. Your booking is NOT confirmed.');
                setLoading(false);
            };

            window.payhere.onError = function(err) {
                axios.delete(`${API}/v1/laboratory/reports/${reportId}/cancel`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('cl_token')}` }
                }).catch(e => console.error('Cleanup failed', e));

                setError('Payment failed: ' + err);
                setLoading(false);
            };

            window.payhere.startPayment({
                sandbox: true,
                merchant_id: merchantId,
                return_url: undefined, // Stay on page to handle JS callbacks
                cancel_url: undefined,
                notify_url: 'http://localhost:8081/api/v1/laboratory/payhere-notify',
                order_id: orderId,
                items: selectedTest.name,
                amount: formattedAmount,
                currency: 'LKR',
                hash,
                first_name: user?.firstName || 'Patient',
                last_name: user?.lastName || '',
                email: user?.email || '',
                phone: user?.phone || '0770000000',
                address: 'No. 1, CareLink Street',
                city: 'Colombo',
                country: 'Sri Lanka'
            });

        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Please try again.');
            setLoading(false);
        }
    };

    // Auto-restore logic for lab booking
    useEffect(() => {
        const saved = sessionStorage.getItem('cl_pending_lab_booking');
        if (saved && !!localStorage.getItem('cl_token')) {
            const parsed = JSON.parse(saved);
            setSelectedTest(parsed.selectedTest);
            setSelectedSlot(parsed.selectedSlot);
            setStep(4);
            sessionStorage.removeItem('cl_pending_lab_booking');
            setTimeout(() => {
                document.getElementById('lab-tests')?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }, []);



    if (step === 5 && bookingResult) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{
                    width: '90px', height: '90px',
                    background: 'rgba(207,249,113,0.1)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 0 40px rgba(207,249,113,0.25)',
                    border: '1px solid rgba(207,249,113,0.3)'
                }}>
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#CFF971" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(207,249,113,0.8))' }}>
                        {/* Stylized handshake/partnership geometry + Checkmark */}
                        <path d="M8 10c-2 0-3 1-3 3s1 3 3 3s3-1 3-3V9" />
                        <path d="M16 14c2 0 3-1 3-3s-1-3-3-3s-3 1-3 3v4" />
                        <path d="M7 13l4 4 8-8" strokeWidth="2.5" />
                    </svg>
                </div>
                <h3>Lab Booking Confirmed!</h3>
                <p>Reference: <strong style={{ color: 'var(--primary)' }}>{bookingResult.bookingReference}</strong></p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You can view details in your dashboard.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                    <button className="btn btn-outline" style={{ margin: 0, flex: 1, minWidth: '150px' }} onClick={() => { setSelectedTest(null); setSelectedSlot(null); setStep(1); }}>Book Another</button>
                    <button className="btn btn-primary" style={{ margin: 0, flex: 1, minWidth: '150px' }} onClick={() => navigate('/patient/dashboard')}>Go to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Simple Step Breadcrumb */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', justifyContent: 'center' }}>
                {[1, 2, 3, 4].map(s => (
                    <div key={s} style={{ height: '4px', flex: 1, maxWidth: '40px', background: step >= s ? 'var(--primary)' : 'var(--border)', borderRadius: '2px' }} />
                ))}
            </div>

            {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>Select a Test</h4>
                    {labTests.map(test => (
                        <div key={test.id} onClick={() => { setSelectedTest(test); setStep(2); }} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer', background: 'var(--bg-input)' }}>
                            <div style={{ fontWeight: 700 }}>{test.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{test.description}</div>
                            <div style={{ marginTop: '0.5rem', color: 'var(--primary)', fontWeight: 700 }}>LKR {test.price?.toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            )}

            {step === 2 && selectedTest && (
                <div style={{ textAlign: 'center' }}>
                    <h4>Preparation for {selectedTest.name}</h4>
                    <div style={{ padding: '1.5rem', background: selectedTest.fastingRequired ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.03)', border: selectedTest.fastingRequired ? '1px solid rgba(251,191,36,0.2)' : '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', margin: '1rem 0' }}>
                        {selectedTest.fastingRequired && <div style={{ color: '#FBBF24', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}><span>⚠️</span> Fasting Required</div>}
                        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', margin: 0 }}>{selectedTest.prepInstructions || 'No special preparation needed.'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" className="btn btn-outline" onClick={() => setStep(1)} style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                            Back
                        </button>
                        <button type="button" className="btn btn-primary" onClick={() => setStep(3)} style={{ flex: 1, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            Continue
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div>
                    <h4>Choose Date & Time</h4>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
                        {availableDates.map(d => (
                            <button key={d} onClick={() => setSelectedDate(d)} className={`btn ${selectedDate === d ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}>
                                {new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </button>
                        ))}
                    </div>
                    {selectedDate && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem' }}>
                            {slotsByDate[selectedDate].map(slot => (
                                <button key={slot.id} onClick={() => setSelectedSlot(slot)} className={`btn ${selectedSlot?.id === slot.id ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.5rem', fontSize: '0.8rem' }}>
                                    {new Date(slot.testTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </button>
                            ))}
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="button" className="btn btn-outline" onClick={() => setStep(2)} style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                            Back
                        </button>
                        <button type="button" className="btn btn-primary" disabled={!selectedSlot} onClick={() => setStep(4)} style={{ flex: 1, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            Review
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            )}

            {step === 4 && selectedTest && selectedSlot && (
                <div>
                    <h4>Confirm Lab Booking</h4>
                    <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Test:</span>
                            <span style={{ fontWeight: 700, textAlign: 'right', flex: 1, paddingLeft: '1rem' }}>{selectedTest.name}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Date:</span>
                            <span style={{ fontWeight: 600 }}>{new Date(selectedSlot.testTime).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Time:</span>
                            <span style={{ fontWeight: 600 }}>{new Date(selectedSlot.testTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '0.4rem', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>Total Price:</span>
                            <span style={{ color: '#1AB088', fontWeight: 800, fontSize: '1.1rem' }}>LKR {selectedTest.price?.toLocaleString()}</span>
                        </div>
                    </div>
                    {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" className="btn btn-outline" onClick={() => setStep(3)} style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                            Back
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleConfirmBooking} disabled={loading} style={{ flex: 1, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            {loading ? 'Booking...' : (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                    Confirm Now
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Reviews Section ────────────────────────────────────────────────────────
function ReviewsSection() {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ rating: 5, comment: '' });
    const [successMsg, setSuccessMsg] = useState('');
    const [starFilter, setStarFilter] = useState(null); // null=all, 1-5
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [formHover, setFormHover] = useState(false);
    const scrollRef = React.useRef(null);
    const isPaused = React.useRef(false);

    useEffect(() => { fetchReviews(); }, []);

    const fetchReviews = async () => {
        try {
            const r = await axios.get(`${API}/v1/reviews`);
            setReviews(r.data);
        } catch (e) { console.error('Failed to fetch reviews', e); }
        finally { setLoading(false); }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete your review?')) return;
        try {
            await axios.delete(`${API}/v1/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('cl_token')}` }
            });
            fetchReviews();
        } catch (e) { alert('Failed to delete review.'); }
    };

    const userReview = reviews.find(r => user && String(r.reviewerId) === String(user.id));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);
        try {
            // 1. Send feedback text to the new FastAPI Sentiment Analysis endpoint
            await axios.post('http://localhost:8000/api/feedback', {
                user_id: String(user.id),
                user_name: `${user.firstName} ${user.lastName}`,
                feedback_text: form.comment
            });

            // 2. Also save to the existing Spring Boot reviews endpoint to update the UI
            await axios.post(`${API}/v1/reviews`, form, {
                headers: { Authorization: `Bearer ${localStorage.getItem('cl_token')}` }
            });

            setSuccessMsg('Thank you for your feedback! ✨');
            setForm({ rating: 5, comment: '' });
            fetchReviews();
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (e) {
            console.error('Feedback submission error', e);
            alert('Failed to submit feedback. Try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Auto-scroll upward, seamless loop
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        let frame;
        const step = () => {
            if (!isPaused.current && el) {
                el.scrollTop += 0.6;
                if (el.scrollTop >= el.scrollHeight / 2) el.scrollTop = 0;
            }
            frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [reviews, starFilter]);

    // Close dropdown on outside click
    useEffect(() => {
        if (!dropdownOpen) return;
        const close = () => setDropdownOpen(false);
        window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, [dropdownOpen]);

    const filteredReviews = starFilter ? reviews.filter(r => r.rating === starFilter) : reviews;
    const displayReviews = [...filteredReviews, ...filteredReviews];

    const filterLabel = starFilter ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(starFilter)].map((_, i) => <StarIcon key={i} filled={true} style={{ width: '12px', height: '12px' }} />)}
            </div>
            <span>{starFilter} Star</span>
        </div>
    ) : 'All Reviews ▾';

    return (
        <section id="reviews" style={{ padding: '7rem 5%', backgroundColor: 'rgba(10,25,28,0.6)', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>



                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5rem', alignItems: 'flex-start' }}>

                    {/* LEFT: Scrolling Reviews Column */}
                    <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Single Dropdown Filter */}
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <button
                                    onClick={e => { e.stopPropagation(); setDropdownOpen(o => !o); }}
                                    style={{
                                        padding: '0.55rem 1.4rem', borderRadius: '100px',
                                        border: '1px solid rgba(207,249,113,0.35)',
                                        background: 'rgba(207,249,113,0.1)',
                                        color: '#CFF971', fontSize: '0.9rem', fontWeight: 700,
                                        cursor: 'pointer', letterSpacing: '0.03em',
                                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {filterLabel}
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CFF971" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>

                                {dropdownOpen && (
                                    <div onClick={e => e.stopPropagation()} style={{
                                        position: 'absolute', top: 'calc(100% + 0.5rem)', left: 0, zIndex: 10,
                                        background: 'rgba(15,40,30,0.98)', border: '1px solid rgba(207,249,113,0.2)',
                                        borderRadius: '16px', overflow: 'hidden', minWidth: '200px',
                                        boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                                        backdropFilter: 'blur(20px)',
                                    }}>
                                        {[null, 5, 4, 3, 2, 1].map(val => (
                                            <button
                                                key={val ?? 'all'}
                                                onClick={() => { setStarFilter(val); setDropdownOpen(false); }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.7rem',
                                                    width: '100%', textAlign: 'left', padding: '0.85rem 1.4rem',
                                                    background: starFilter === val ? 'rgba(207,249,113,0.12)' : 'transparent',
                                                    border: 'none', borderBottom: val !== 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                                    color: starFilter === val ? '#CFF971' : 'rgba(255,255,255,0.75)',
                                                    fontSize: '0.9rem', fontWeight: starFilter === val ? 700 : 500,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {val === null ? (
                                                    <><span style={{ fontSize: '1rem' }}>✦</span> All Reviews</>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                        <div style={{ display: 'flex', gap: '2px' }}>
                                                            {[...Array(val)].map((_, i) => (
                                                                <StarIcon key={i} filled={true} style={{ width: '12px', height: '12px' }} />
                                                            ))}
                                                        </div>
                                                        <span>{val} Star</span>
                                                    </div>
                                                )}
                                                {starFilter === val && <span style={{ marginLeft: 'auto', color: '#CFF971' }}>✓</span>}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Scrolling Cards Container */}
                        <div style={{ position: 'relative', height: '480px' }}>
                            {/* Top & bottom fade */}
                            <div style={{
                                position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
                                maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                            }} />

                            {loading ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                    <div className="spinner" />
                                </div>
                            ) : filteredReviews.length === 0 ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.12)' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>No {starFilter ? `${starFilter}-star ` : ''}reviews yet.</p>
                                </div>
                            ) : (
                                <div
                                    ref={scrollRef}
                                    onMouseEnter={() => { isPaused.current = true; }}
                                    onMouseLeave={() => { isPaused.current = false; }}
                                    style={{
                                        height: '100%', overflowY: 'scroll',
                                        display: 'flex', flexDirection: 'column', gap: '1.2rem',
                                        paddingRight: '0.5rem',
                                        scrollbarWidth: 'none', msOverflowStyle: 'none',
                                    }}
                                >
                                    {displayReviews.map((r, idx) => (
                                        <div key={idx} style={{
                                            flexShrink: 0, padding: '1.5rem 1.8rem',
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '20px', backdropFilter: 'blur(16px)',
                                            position: 'relative', overflow: 'hidden',
                                        }}>
                                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #CFF971, #1AB088)' }} />

                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem', alignItems: 'flex-start' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{r.reviewerName}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem' }}>
                                                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', fontWeight: 600 }}>{r.role}</span>
                                                        <span>•</span>
                                                        <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <StarIcon key={s} filled={s <= r.rating} style={{ width: '14px', height: '14px' }} />
                                                    ))}
                                                </div>
                                            </div>

                                            <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontStyle: 'italic', margin: 0 }}>
                                                "{r.comment}"
                                            </p>

                                            {user && String(r.reviewerId) === String(user.id) && idx < filteredReviews.length && (
                                                <button onClick={() => handleDelete(r.id)}
                                                    style={{ marginTop: '0.9rem', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.7, padding: 0, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'opacity 0.2s' }}
                                                    onMouseOver={e => e.currentTarget.style.opacity = '1'}
                                                    onMouseOut={e => e.currentTarget.style.opacity = '0.7'}
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                    Delete My Review
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Header + Share your Experience Form */}
                    <div style={{ flex: '1 1 380px' }}>

                        {/* Header moved inside the column */}
                        <div style={{ marginBottom: '3rem' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(207,249,113,0.12)', border: '1px solid rgba(207,249,113,0.25)', borderRadius: '100px', padding: '0.35rem 1rem', marginBottom: '1.2rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CFF971', letterSpacing: '0.08em' }}>TESTIMONIALS</span>
                            </div>
                            <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '1rem' }}>Patient Feedback</h2>
                            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', lineHeight: 1.7 }}>
                                Hear from our community about their experience with CareLink.
                            </p>
                        </div>
                        <div
                            className="glass-card"
                            onMouseEnter={() => setFormHover(true)}
                            onMouseLeave={() => setFormHover(false)}
                            style={{
                                padding: '2.5rem',
                                border: formHover ? '1px solid rgba(207,249,113,0.5)' : '1px solid rgba(207,249,113,0.2)',
                                borderRadius: '24px',
                                transition: 'all 0.3s ease',
                                transform: formHover ? 'translateY(-8px)' : 'translateY(0)',
                                boxShadow: formHover
                                    ? '0 20px 40px -15px rgba(0,0,0,0.5), 0 0 20px rgba(207,249,113,0.2)'
                                    : '0 10px 30px -10px rgba(0,0,0,0.3)',
                                background: formHover ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)'
                            }}
                        >
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff', fontWeight: 700 }}>
                                <span>✍️</span> Share your Experience
                            </h3>

                            {!user ? (
                                <div style={{ padding: '2.5rem 1rem', textAlign: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.15)' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                        Only registered users can share feedback.
                                    </p>
                                    <Link to="/login?redirect=reviews" style={{
                                        display: 'inline-block', textDecoration: 'none',
                                        background: '#CFF971', color: '#0a2e0e',
                                        padding: '0.7rem 1.8rem', borderRadius: '12px',
                                        fontWeight: 700, fontSize: '0.95rem',
                                        boxShadow: '0 4px 20px rgba(207,249,113,0.35)',
                                    }}>
                                        Sign In to Review
                                    </Link>
                                </div>
                            ) : userReview ? (
                                <div style={{ padding: '2rem', background: 'rgba(207,249,113,0.06)', borderRadius: '16px', border: '1px solid rgba(207,249,113,0.2)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                                    <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: '#fff', fontSize: '1.05rem' }}>You've shared your thoughts!</div>
                                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.2rem' }}>
                                        You can only post one review. Delete your current one to update it.
                                    </p>
                                    <button className="btn" style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 700, border: '1px solid var(--danger)', padding: '0.5rem 1.2rem' }} onClick={() => handleDelete(userReview.id)}>
                                        Delete My Review
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Your Rating</label>
                                        <div style={{ display: 'flex', gap: '10px', padding: '0.5rem 0' }}>
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <StarIcon
                                                    key={s}
                                                    filled={s <= form.rating}
                                                    onClick={() => setForm(f => ({ ...f, rating: s }))}
                                                    style={{ width: '30px', height: '30px', transition: 'transform 0.2s', cursor: 'pointer' }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Review Details</label>
                                        <textarea
                                            className="form-input"
                                            rows={5}
                                            required
                                            placeholder="Tell us what you liked about CareLink..."
                                            value={form.comment}
                                            onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                                        />
                                    </div>
                                    {successMsg && (
                                        <div style={{ color: '#CFF971', fontSize: '0.9rem', fontWeight: 600 }}>{successMsg}</div>
                                    )}
                                    <button className="btn btn-primary" disabled={submitting} style={{ width: '100%', marginTop: '0.25rem' }}>
                                        {submitting ? 'Submitting...' : 'Post Review'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}


// ── Main Landing Page ─────────────────────────────────────────────────────────
export default function LandingPage() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeNotice, setActiveNotice] = useState(null);

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const res = await axios.get(`${API}/v1/notices/active`);
                setActiveNotice(res.data);
            } catch (error) {
                console.error('Failed to fetch notice:', error);
            }
        };
        fetchNotice();
    }, []);

    useEffect(() => {
        if (location.hash === '#reviews') {
            const el = document.getElementById('reviews');
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth' });
                }, 200);
            }
        }
    }, [location.hash]);

    if (loading) return <div className="auth-page"><div className="spinner" /></div>;
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <style>{`
                @keyframes spin-slow { 100% { transform: rotate(360deg); } }
                @keyframes spin-slow-reverse { 100% { transform: rotate(-360deg); } }
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
            `}</style>

            {/* ── NAVIGATION ── */}
            <nav style={{
                padding: '1.1rem 5%',
                background: 'transparent',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '1300px',
                    margin: '0 auto',
                    width: '100%',
                }}>
                    {/* Logo */}
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a8f04a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>CareLink</span>
                    </Link>

                    {/* Center Pill Nav */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        background: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(16px)',
                        borderRadius: '100px',
                        padding: '0.45rem 0.6rem',
                        border: '1px solid rgba(255,255,255,0.15)',
                    }}>
                        <div style={{
                            width: '34px', height: '34px', borderRadius: '50%',
                            background: 'rgba(168,240,74,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8f04a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </div>
                        <a href="#services" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, padding: '0.3rem 1rem', borderRadius: '100px', transition: 'color 0.2s' }}
                            onMouseOver={e => e.currentTarget.style.color = '#a8f04a'}
                            onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
                        >Services</a>
                        <a href="#about-us" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, padding: '0.3rem 1rem', borderRadius: '100px', transition: 'color 0.2s' }}
                            onMouseOver={e => e.currentTarget.style.color = '#a8f04a'}
                            onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
                        >About Us</a>
                    </div>

                    {/* Right Side Auth Buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        {user ? (
                            <>
                                <NotificationBell />
                                <Link to={(() => {
                                    if (user.role === 'ADMIN') return '/dashboard';
                                    if (user.role === 'DOCTOR') return '/doctor/dashboard';
                                    if (user.role === 'PHARMACIST') return '/pharmacy/dashboard';
                                    if (user.role === 'SUPPLIER') return '/supplier/dashboard';
                                    if (user.role === 'LAB_TECH') return '/lab/dashboard';
                                    return '/patient/dashboard';
                                })()}
                                    style={{
                                        textDecoration: 'none',
                                        color: '#fff',
                                        fontWeight: 600,
                                        fontSize: '0.88rem',
                                        padding: '0.55rem 1.3rem',
                                        borderRadius: '100px',
                                        border: '1.5px solid rgba(255,255,255,0.35)',
                                        background: 'transparent',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseOver={e => { e.currentTarget.style.borderColor = '#a8f04a'; e.currentTarget.style.color = '#a8f04a'; }}
                                    onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = '#fff'; }}
                                >
                                    My Dashboard
                                </Link>
                                <button onClick={() => { logout(); navigate('/'); }}
                                    style={{ 
                                        background: 'transparent', 
                                        border: '1.5px solid rgba(255, 255, 255, 0.35)', 
                                        color: '#fff', 
                                        padding: '0.55rem 1.3rem',
                                        borderRadius: '100px',
                                        cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600,
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
                                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)'; e.currentTarget.style.color = '#fff'; }}
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => navigate('/login')} style={{
                                    background: 'transparent',
                                    border: '1.5px solid rgba(255,255,255,0.35)',
                                    color: '#fff',
                                    padding: '0.55rem 1.3rem',
                                    borderRadius: '100px',
                                    fontSize: '0.88rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                    onMouseOver={e => { e.currentTarget.style.borderColor = '#CFF971'; e.currentTarget.style.color = '#CFF971'; }}
                                    onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = '#fff'; }}
                                >
                                    Sign In
                                </button>
                                <Link to="/register" style={{
                                    textDecoration: 'none',
                                    background: '#CFF971',
                                    color: '#0a2e0e',
                                    padding: '0.55rem 1.3rem',
                                    borderRadius: '100px',
                                    fontSize: '0.88rem',
                                    fontWeight: 700,
                                    transition: 'all 0.2s',
                                    display: 'inline-block',
                                }}
                                    onMouseOver={e => { e.currentTarget.style.background = '#dffb8a'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                    onMouseOut={e => { e.currentTarget.style.background = '#CFF971'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── HERO SECTION ── */}
            <header style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: 'transparent',
                padding: '0 5%',
            }}>
                {/* Background radial glow & AI Nodes */}
                <div style={{ position: 'absolute', top: '0%', right: '0%', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(26,176,136,0.08) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '0', left: '0', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(15,55,58,0.4) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '20%', left: '15%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(207,249,113,0.15) 0%, transparent 60%)', zIndex: 0, pointerEvents: 'none', filter: 'blur(10px)' }} />

                {/* Floating "AI Network" SVGs */}
                <svg style={{ position: 'absolute', top: '15%', right: '25%', opacity: 0.15, zIndex: 0, pointerEvents: 'none' }} width="300" height="300" viewBox="0 0 100 100">
                    <circle cx="20" cy="20" r="2" fill="#CFF971" />
                    <circle cx="80" cy="30" r="3" fill="#1AB088" />
                    <circle cx="50" cy="80" r="2" fill="#CFF971" />
                    <line x1="20" y1="20" x2="80" y2="30" stroke="rgba(207,249,113,0.5)" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="20" y1="20" x2="50" y2="80" stroke="rgba(26,176,136,0.5)" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="80" y1="30" x2="50" y2="80" stroke="rgba(207,249,113,0.5)" strokeWidth="0.5" strokeDasharray="2,2" />
                </svg>

                {/* Subtle grid pattern */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.04, backgroundImage: 'linear-gradient(rgba(207,249,113,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(207,249,113,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

                {/* Hero Content Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1300px', margin: '0 auto', position: 'relative', zIndex: 2, paddingTop: '5rem' }}>

                    {/* LEFT: Text + Buttons */}
                    <div style={{ flex: '0 0 52%', maxWidth: '650px', zIndex: 4 }}>
                        {activeNotice && (
                            <div className="animate-in" style={{ 
                                background: 'rgba(239, 68, 68, 0.1)', 
                                border: '1px solid rgba(239, 68, 68, 0.3)', 
                                borderRadius: '12px', 
                                marginBottom: '2.5rem',
                                backdropFilter: 'blur(10px)',
                                overflow: 'hidden',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                position: 'relative'
                            }}>
                                <div style={{ 
                                    position: 'absolute', left: 0, top: 0, bottom: 0, 
                                    background: '#ef4444', color: '#fff', 
                                    padding: '0 1rem', display: 'flex', alignItems: 'center', 
                                    fontSize: '0.75rem', fontWeight: 900, zIndex: 10,
                                    textTransform: 'uppercase', letterSpacing: '0.05em',
                                    boxShadow: '10px 0 20px rgba(0,0,0,0.2)'
                                }}>
                                    LATEST NOTICE
                                </div>
                                <div style={{
                                    whiteSpace: 'nowrap',
                                    display: 'inline-block',
                                    paddingLeft: '110%',
                                    animation: 'marquee 25s linear infinite',
                                    color: '#f87171',
                                    fontWeight: 600,
                                    fontSize: '0.95rem'
                                }}>
                                    <span style={{ marginRight: '4rem' }}>{activeNotice.title}: {activeNotice.content}</span>
                                    <span>{activeNotice.title}: {activeNotice.content}</span>
                                </div>
                            </div>
                        )}
                        <h1 className="animate-in" style={{
                            fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
                            fontWeight: 800,
                            lineHeight: 1.2,
                            color: '#fff',
                            margin: '0 0 1.5rem',
                        }}>
                            Smarter AI Healthcare<br />
                            Starts With{' '}
                            <span style={{ position: 'relative', display: 'inline-block', color: '#CFF971' }}>
                                CareLink
                                <div style={{ position: 'absolute', bottom: '6px', left: '-5%', width: '110%', height: '12px', background: 'rgba(207,249,113,0.25)', borderRadius: '4px', zIndex: -1, transform: 'rotate(-2deg)' }} />
                                <svg style={{ position: 'absolute', top: '-18px', right: '-25px', width: '32px', height: '32px' }} viewBox="0 0 24 24" fill="none" stroke="#CFF971" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                            </span>.
                        </h1>
                        <p className="animate-in" style={{
                            fontSize: '1rem',
                            color: 'rgba(255,255,255,0.9)',
                            lineHeight: 1.7,
                            margin: '0 0 2.2rem',
                            maxWidth: '440px',
                            animationDelay: '0.1s',
                            animationFillMode: 'both',
                        }}>
                            CareLink bridges the gap between patients, doctors, pharmacies,
                            and laboratories. Experience seamless healthcare management
                            with our modern, secure platform.
                        </p>

                        {/* Primary CTA Row */}
                        <div className="animate-in" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', animationDelay: '0.2s', animationFillMode: 'both' }}>
                            <Link to="/register/patient" style={{
                                textDecoration: 'none',
                                background: '#a8f04a',
                                color: '#0a2e0e',
                                padding: '0.85rem 1.6rem',
                                borderRadius: '12px',
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 20px rgba(168,240,74,0.3)',
                            }}
                                onMouseOver={e => { e.currentTarget.style.background = '#c2f76a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseOut={e => { e.currentTarget.style.background = '#a8f04a'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >Get Started as Patient</Link>
                            <Link to="/login" style={{
                                textDecoration: 'none',
                                background: 'transparent',
                                color: '#fff',
                                padding: '0.85rem 1.6rem',
                                borderRadius: '12px',
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                border: '2px solid rgba(255,255,255,0.3)',
                                transition: 'all 0.2s',
                            }}
                                onMouseOver={e => { e.currentTarget.style.borderColor = '#CFF971'; e.currentTarget.style.color = '#CFF971'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >Login as Doctor</Link>
                        </div>

                        {/* Social Proof Row */}
                        <div className="animate-in" style={{ display: 'flex', alignItems: 'center', gap: '1rem', animationDelay: '0.3s', animationFillMode: 'both' }}>
                            <div style={{ display: 'flex', marginLeft: '10px' }}>
                                <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid #0f373a', background: 'rgba(207,249,113,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-10px', zIndex: 3 }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CFF971" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
                                </div>
                                <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid #0f373a', background: 'rgba(26,176,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-10px', zIndex: 2 }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1AB088" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3v15.82a2 2 0 0 0 1.11 1.79l.89.44a2 2 0 0 0 1.79 0l.89-.44A2 2 0 0 0 15 18.82V3" /><path d="M7 3h10" /><path d="M9 11h6" /></svg>
                                </div>
                                <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid #0f373a', background: 'rgba(207,249,113,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-10px', zIndex: 1 }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CFF971" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '22px', height: '22px', borderRadius: '50%',
                                    background: '#CFF971',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 0 12px rgba(207,249,113,0.5)',
                                    color: '#0a2e0e', fontSize: '13px', fontWeight: 800, flexShrink: 0
                                }}>
                                    ✓
                                </div>
                                <div style={{ fontWeight: 500, lineHeight: 1.4, maxWidth: '250px' }}>Partnered with top certified labs & verified specialists.</div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Doctor Image + Floating Cards */}
                    <div style={{ flex: '0 0 48%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', minHeight: '680px', overflow: 'visible' }}>

                        {/* Circular Tech Decoration behind doctor */}
                        <div style={{
                            position: 'absolute',
                            top: '45%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '600px',
                            height: '600px',
                            zIndex: 1,
                            pointerEvents: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {/* Soft Glow directly behind the doctor */}
                            <div style={{
                                position: 'absolute',
                                width: '400px',
                                height: '400px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)',
                                filter: 'blur(20px)',
                            }} />
                            {/* Outer dashed ring */}
                            <svg style={{ position: 'absolute', animation: 'spin-slow 40s linear infinite' }} width="500" height="500" viewBox="0 0 500 500">
                                <circle cx="250" cy="250" r="240" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="4 12" strokeLinecap="round" />
                                <circle cx="10" cy="250" r="4" fill="#fff" />
                                <circle cx="490" cy="250" r="4" fill="#fff" />
                            </svg>
                            {/* Middle trail ring */}
                            <svg style={{ position: 'absolute', animation: 'spin-slow-reverse 30s linear infinite' }} width="380" height="380" viewBox="0 0 380 380">
                                <circle cx="190" cy="190" r="180" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="60 30" strokeLinecap="round" />
                                <circle cx="190" cy="10" r="5" fill="#fff" filter="blur(2px)" />
                                <circle cx="190" cy="10" r="2" fill="#fff" />
                            </svg>
                            {/* Inner dotted ring */}
                            <svg style={{ position: 'absolute', animation: 'spin-slow 50s linear infinite' }} width="280" height="280" viewBox="0 0 280 280">
                                <circle cx="140" cy="140" r="130" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 8" strokeLinecap="round" />
                                <circle cx="140" cy="270" r="3" fill="#fff" />
                            </svg>
                        </div>

                        {/* Doctor image */}
                        <img
                            src="/hero-doctor.png"
                            alt="CareLink doctor"
                            style={{
                                position: 'absolute',
                                bottom: '-40px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                height: '115%',
                                width: 'auto',
                                maxWidth: 'none',
                                objectFit: 'cover',
                                objectPosition: 'top center',
                                zIndex: 2,
                                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))',
                            }}
                        />

                        {/* Floating Dashboard Card */}
                        <div style={{
                            position: 'absolute',
                            top: '12%',
                            left: '-6%',
                            background: 'rgba(15,40,25,0.85)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(207,249,113,0.3)',
                            borderRadius: '16px',
                            padding: '1rem 1.2rem',
                            zIndex: 5,
                            width: '210px',
                            boxShadow: '0 10px 30px rgba(207,249,113,0.2)',
                            animation: 'heroFloat 4s ease-in-out infinite',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CFF971" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>Dashboard Report</span>
                            </div>
                            {/* Mini chart bars */}
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '45px', marginBottom: '0.5rem' }}>
                                {[30, 55, 40, 70, 50, 80, 60, 90, 65, 85].map((h, i) => (
                                    <div key={i} style={{ flex: 1, height: `${h}%`, background: i % 2 === 0 ? 'rgba(207,249,113,0.65)' : 'rgba(26,176,136,0.45)', borderRadius: '2px 2px 0 0', transition: 'height 0.3s' }} />
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>
                                <span>Appointments</span>
                                <span style={{ color: '#CFF971', fontWeight: 600 }}>+24%</span>
                            </div>
                        </div>

                        {/* Floating Vital Stats Card */}
                        <div style={{
                            position: 'absolute',
                            top: '40%',
                            right: '-3%',
                            background: 'rgba(15,40,25,0.85)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(26,176,136,0.4)',
                            borderRadius: '16px',
                            padding: '1rem 1.2rem',
                            zIndex: 4,
                            width: '155px',
                            boxShadow: '0 10px 30px rgba(26,176,136,0.25)',
                            animation: 'heroFloat 4s ease-in-out infinite 1.5s',
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(207,249,113,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#CFF971" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>Vital Stat</div>
                                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>98.6°F</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,180,120,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00c6a7" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>Pulse</div>
                                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>72 bpm</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sparkle decoration */}
                        <div style={{ position: 'absolute', bottom: '8%', right: '4%', zIndex: 3 }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="rgba(207,249,113,0.6)">
                                <polygon points="12,2 14.4,9.4 22,9.4 16.1,14.1 18.5,21.5 12,17.3 5.5,21.5 7.9,14.1 2,9.4 9.6,9.4" />
                            </svg>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── BOOKING SECTION ─────────────────────────────────────────────── */}
            <section id="book" style={{ padding: '7rem 5%', background: 'rgba(10,25,28,0.6)', position: 'relative' }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '4rem'
                }}>

                    {/* LEFT: The "Sell" */}
                    <div className="animate-in" style={{ flex: '1 1 400px', paddingRight: '2rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(207,249,113,0.1)', border: '1px solid rgba(207,249,113,0.2)', borderRadius: '100px', padding: '0.4rem 1rem', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CFF971', letterSpacing: '0.05em' }}>EASY SCHEDULING</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.2rem)', marginBottom: '1.2rem', lineHeight: '1.1', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                            Book Your Doctor Appointment
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                            Choose your specialist, pick a convenient slot, and confirm your visit — all in just a few seamless steps without any hassle.
                        </p>

                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {[
                                'Instant Confirmation',
                                'Verified Doctor Selection',
                                'Secure & Private Health Data',
                            ].map((text, idx) => (
                                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.05rem', color: '#fff', fontWeight: 500 }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(207,249,113,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CFF971" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    </div>
                                    {text}
                                </li>
                            ))}
                        </ul>

                        {/* Trust Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', width: 'fit-content', marginTop: '2rem' }}>
                            <div style={{
                                width: '34px', height: '34px',
                                borderRadius: '50%',
                                border: '3.5px solid #CFF971',
                                background: 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 12px rgba(207,249,113,0.4), inset 0 0 6px rgba(207,249,113,0.3)',
                                flexShrink: 0
                            }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CFF971" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(207,249,113,0.8))' }}><polyline points="20 6 9 17 4 12" /></svg>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', fontWeight: 400 }}>
                                Access to <span style={{ color: '#CFF971', fontWeight: 700 }}>100% Verified</span> Specialist
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: The Action / Booking Wizard */}
                    <div className="animate-in" style={{ flex: '1 1 500px', position: 'relative', animationDelay: '0.3s' }}>
                        {/* Decorative background glow behind the form */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(207,249,113,0.06) 0%, transparent 60%)', zIndex: 0, pointerEvents: 'none' }} />

                        <div className="glass-card" style={{
                            padding: '1.5rem',
                            border: '1px solid rgba(207,249,113,0.35)',
                            borderRadius: '24px',
                            background: 'rgba(15,40,25,0.6)',
                            backdropFilter: 'blur(24px)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(207,249,113,0.1), 0 0 20px rgba(207,249,113,0.18), 0 0 50px rgba(207,249,113,0.08)',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <BookingWizard />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── LAB TESTS SECTION ────────────────────────────────────────────── */}
            <section id="lab-tests" style={{ padding: '7rem 5%', backgroundColor: 'rgba(26,176,136,0.02)', position: 'relative' }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    flexWrap: 'wrap-reverse',
                    alignItems: 'center',
                    gap: '4rem'
                }}>

                    {/* LEFT: The Action / Lab Booking Wizard */}
                    <div className="animate-in" style={{ flex: '1 1 500px', position: 'relative' }}>
                        {/* Decorative background glow behind the form */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(26,176,136,0.06) 0%, transparent 60%)', zIndex: 0, pointerEvents: 'none' }} />

                        <div className="glass-card" style={{
                            padding: '1.5rem',
                            border: '1px solid rgba(207,249,113,0.35)',
                            borderRadius: '24px',
                            background: 'rgba(15,40,35,0.6)',
                            backdropFilter: 'blur(24px)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(207,249,113,0.1), 0 0 20px rgba(207,249,113,0.18), 0 0 50px rgba(207,249,113,0.08)',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <LabBookingWizard />
                        </div>
                    </div>

                    {/* RIGHT: The "Sell" */}
                    <div className="animate-in" style={{ flex: '1 1 400px', paddingLeft: '2rem', animationDelay: '0.2s' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(207,249,113,0.12)', border: '1px solid rgba(207,249,113,0.25)', borderRadius: '100px', padding: '0.35rem 1rem', marginBottom: '1.2rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CFF971', letterSpacing: '0.08em' }}>DIAGNOSTIC CENTER</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.2rem)', marginBottom: '1.2rem', lineHeight: '1.1', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                            Book Your Lab Test Instantly
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                            Precision diagnostics at your convenience. Book blood tests, screenings, and comprehensive profiles from the comfort of your home.
                        </p>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {[
                                'Focus on Convenience',
                                'Fast Digital Results',
                                'NABL Certified Partner Labs',
                            ].map((text, idx) => (
                                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.05rem', color: '#fff', fontWeight: 500 }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(207,249,113,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CFF971" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    </div>
                                    {text}
                                </li>
                            ))}
                        </ul>

                        {/* Committment Badge with 100% Glowing Ring */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', width: 'fit-content' }}>
                            <div style={{
                                width: '34px', height: '34px',
                                borderRadius: '50%',
                                border: '3.5px solid #CFF971',
                                background: 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 12px rgba(207,249,113,0.4), inset 0 0 6px rgba(207,249,113,0.3)',
                                flexShrink: 0
                            }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CFF971" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(207,249,113,0.8))' }}><polyline points="20 6 9 17 4 12" /></svg>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', fontWeight: 400 }}>
                                Committed to <span style={{ color: '#CFF971', fontWeight: 700 }}>100% Accurate</span> Results
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── DISEASE PREDICTOR SECTION ───────────────────────────────────── */}
            <section id="disease-predictor" style={{ 
                padding: '8rem 5%', 
                background: 'rgba(10,25,28,0.6)',
                borderTop: '1px solid rgba(207,249,113,0.1)',
                borderBottom: '1px solid rgba(207,249,113,0.1)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background decorative elements */}
                <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(207,249,113,0.05) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(26,176,136,0.05) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />

                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 1.2fr', gap: '5rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <div className="animate-in" style={{ paddingRight: '2rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(207,249,113,0.1)', border: '1px solid rgba(207,249,113,0.3)', borderRadius: '100px', padding: '0.4rem 1.2rem', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CFF971', letterSpacing: '0.1em' }}>AI DIAGNOSTICS</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 2.8rem)', marginBottom: '1.2rem', fontWeight: 800, color: '#fff' }}>Instant Symptom Analysis</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                            Not sure what's going on? Our AI-powered disease predictor analyzes your symptoms against vast medical datasets to provide instant insights and potential next steps.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#fff', fontSize: '0.95rem', fontWeight: 500 }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(207,249,113,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CFF971" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            </div>
                            Privacy-First: Data is processed locally for your security.
                        </div>
                    </div>
                    <div className="animate-in" style={{ animationDelay: '0.2s' }}>
                        <DiseasePredictor />
                    </div>
                </div>
            </section>

            {/* Features (Why choose CareLink?) */}
            <section style={{ padding: '7rem 5%', background: 'rgba(26,176,136,0.02)', position: 'relative' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(207,249,113,0.1)', border: '1px solid rgba(207,249,113,0.3)', borderRadius: '100px', padding: '0.4rem 1.2rem', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CFF971', letterSpacing: '0.1em' }}>THE CARELINK ADVANTAGE</span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 2.8rem)', marginBottom: '1.2rem', fontWeight: 800 }}>Why choose CareLink?</h2>
                    <p style={{ maxWidth: '650px', margin: '0 auto', color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>Designed to deliver an exceptional experience for everyone involved in the healthcare journey.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                    {[
                        { icon: <ShieldIcon />, title: 'Secure & Private', desc: 'Your medical data is encrypted and protected. Only authorized personnel have access to your personal health information.' },
                        { icon: <ActivityIcon />, title: 'Real-time Tracking', desc: 'Log symptoms, track your medical history, and view your active prescriptions, all updated in real-time.' },
                        { icon: <UsersIcon />, title: 'Unified Network', desc: 'Connect effortlessly with doctors, pharmacies, laboratories, and suppliers within a single, unified ecosystem.' }
                    ].map((feat, idx) => (
                        <div key={idx} className="stat-card" style={{
                            padding: '2.5rem',
                            height: '100%',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '24px',
                            transition: 'transform 0.35s ease, background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease'
                        }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.border = '1px solid rgba(207,249,113,0.4)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(207,249,113,0.1), 0 0 20px rgba(207,249,113,0.2), 0 0 50px rgba(207,249,113,0.08)';
                                e.currentTarget.style.background = 'rgba(207,249,113,0.04)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                            }}
                        >
                            {feat.icon}
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#fff', fontWeight: 700 }}>{feat.title}</h3>
                            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6' }}>{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── OUR SERVICES SECTION ────────────────────────────────────────────── */}
            <section id="services" style={{ padding: '7rem 5%', backgroundColor: 'rgba(10,25,28,0.6)', position: 'relative' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(207,249,113,0.12)', border: '1px solid rgba(207,249,113,0.25)', borderRadius: '100px', padding: '0.35rem 1rem', marginBottom: '1.2rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CFF971', letterSpacing: '0.08em' }}>COMPREHENSIVE CARE</span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3rem)', marginBottom: '1rem', color: '#fff', fontWeight: 800 }}>Our Services</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto', color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem' }}>
                        Everything you need for your health, integrated into a single seamless platform.
                    </p>
                </div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    {[
                        { title: 'Doctor Consultations', desc: 'Book appointments with top specialists and general practitioners instantly across multiple hospitals.', link: '#book' },
                        { title: 'Laboratory Services', desc: 'Schedule lab tests with home collection options and get AI-powered comprehensive reports.', link: '#lab-tests' },
                        { title: 'Medical Records', desc: 'Store, manage, and share your complete medical history securely with your healthcare providers.', link: '/patient/dashboard?tab=history' }
                    ].map((svc, idx) => (
                        <div key={idx} className="glass-card stat-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', transition: 'transform 0.35s ease, background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease' }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.border = '1px solid rgba(207,249,113,0.4)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(207,249,113,0.1), 0 0 20px rgba(207,249,113,0.2), 0 0 50px rgba(207,249,113,0.08)';
                                e.currentTarget.style.background = 'rgba(207,249,113,0.04)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                            }}
                        >
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(207,249,113,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CFF971" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                            </div>
                            <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '1rem', fontWeight: 700 }}>{svc.title}</h3>
                            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: '2rem', flex: 1 }}>{svc.desc}</p>
                            {svc.link.startsWith('#') ? (
                                <a href={svc.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#CFF971', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', transition: 'gap 0.2s' }}
                                    onMouseOver={e => e.currentTarget.style.gap = '0.75rem'}
                                    onMouseOut={e => e.currentTarget.style.gap = '0.5rem'}
                                >Learn More <span style={{ fontSize: '1.1rem' }}>→</span></a>
                            ) : (
                                <Link to={svc.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#CFF971', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', transition: 'gap 0.2s' }}
                                    onMouseOver={e => e.currentTarget.style.gap = '0.75rem'}
                                    onMouseOut={e => e.currentTarget.style.gap = '0.5rem'}
                                >Learn More <span style={{ fontSize: '1.1rem' }}>→</span></Link>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ── ABOUT US SECTION ────────────────────────────────────────────── */}
            <section id="about-us" style={{ padding: '7rem 5%', background: 'rgba(26,176,136,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5rem', maxWidth: '1200px', margin: '0 auto', alignItems: 'center' }}>
                    <div style={{ flex: '1 1 450px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(207,249,113,0.12)', border: '1px solid rgba(207,249,113,0.25)', borderRadius: '100px', padding: '0.35rem 1rem', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CFF971', letterSpacing: '0.08em' }}>ABOUT CARELINK</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.2rem)', marginBottom: '1.5rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>Who We Are</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                            CareLink was founded with a singular mission: to eliminate the friction in healthcare access. We understand that finding the right doctor, managing lab reports, or organizing prescriptions can be overwhelming.
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                            Our unified platform intelligently bridges the gap between patients, medical professionals, laboratories, and pharmacies. By leveraging modern technology, we are dedicated to making comprehensive healthcare completely transparent, secure, and easily accessible to everyone.
                        </p>
                    </div>

                    <div style={{ flex: '1 1 450px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                        {[
                            { value: 'Verified', label: 'Medical Partners' },
                            { value: 'Unified', label: 'Healthcare Network' },
                            { value: '24/7', label: 'Support Available' },
                            { value: '100%', label: 'Secure Platform' }
                        ].map((stat, i) => (
                            <div key={i} className="glass-card" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', transition: 'transform 0.35s ease, background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease' }}
                                onMouseOver={e => {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.border = '1px solid rgba(207,249,113,0.4)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(207,249,113,0.1), 0 0 20px rgba(207,249,113,0.2), 0 0 50px rgba(207,249,113,0.08)';
                                    e.currentTarget.style.background = 'rgba(207,249,113,0.04)';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                }}
                            >
                                <div style={{ fontSize: i < 2 ? '1.8rem' : '2.5rem', fontWeight: 800, color: '#CFF971', marginBottom: '0.5rem' }}>{stat.value}</div>
                                <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <ReviewsSection />

            {/* ── FOOTER ───────────────────────────────────────────────────────── */}
            <footer style={{
                position: 'relative',
                background: '#201f1fff',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: '5rem',
                marginTop: 'auto'
            }}>
                {/* Glowing Neon Divider */}
                <div style={{
                    height: '1px',
                    width: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(207,249,113,0.5), transparent)',
                    position: 'absolute',
                    top: 0
                }} />
                <div style={{
                    height: '20px',
                    width: '100%',
                    background: 'radial-gradient(ellipse at center, rgba(207,249,113,0.05) 0%, transparent 70%)',
                    position: 'absolute',
                    top: 0,
                    pointerEvents: 'none'
                }} />

                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5% 4rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem' }}>

                        {/* Column 1: Brand */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CFF971" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>CareLink</span>
                            </Link>
                            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                                Bridging the gap between patients and healthcare professionals.
                            </p>
                            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                                {[
                                    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>, href: '#' },
                                    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>, href: '#' },
                                    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>, href: '#' }
                                ].map((soc, i) => (
                                    <a key={i} href={soc.href} style={{
                                        width: '36px', height: '36px', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'rgba(207,249,113,0.05)', border: '1px solid rgba(207,249,113,0.15)',
                                        color: '#CFF971', transition: 'all 0.2s ease', textDecoration: 'none',
                                        boxShadow: '0 0 10px rgba(207,249,113,0.05)'
                                    }}
                                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(207,249,113,0.15)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(207,249,113,0.2)'; }}
                                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(207,249,113,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(207,249,113,0.05)'; }}
                                    >
                                        {soc.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em' }}>QUICK LINKS</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                                {[
                                    { label: 'Find a Doctor', href: '#book' },
                                    { label: 'Book Lab Tests', href: '#lab-tests' },
                                    { label: 'Patient Dashboard', href: '/dashboard', active: true }
                                ].map((link, i) => (
                                    <a key={i} href={link.href} style={{
                                        color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem',
                                        textDecoration: 'none', transition: 'all 0.2s',
                                        position: 'relative', width: 'fit-content'
                                    }}
                                        onMouseOver={e => e.currentTarget.style.color = '#fff'}
                                        onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                                    >
                                        {link.label}
                                        {link.active && <div style={{ position: 'absolute', bottom: '-4px', left: 0, width: '100%', height: '1.5px', background: '#CFF971' }} />}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Column 3: Support & Legal */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em' }}>SUPPORT & LEGAL</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                                {[
                                    { label: 'Help Center', path: '/help' },
                                    { label: 'Privacy Policy', path: '/privacy' },
                                    { label: 'Terms of Service', path: '/terms' },
                                    { label: 'Security', path: '/security' }
                                ].map((link, i) => (
                                    <Link key={i} to={link.path} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}
                                        onMouseOver={e => e.currentTarget.style.color = '#fff'}
                                        onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                                    >{link.label}</Link>
                                ))}
                            </div>
                        </div>

                        {/* Column 4: Contact & Map */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em' }}>CONTACT US</h4>
                            <div style={{
                                borderRadius: '16px', overflow: 'hidden', height: '140px',
                                position: 'relative', border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)',
                            }}>
                                {/* Map Embed with Dark Mode Filter */}
                                <iframe
                                    title="location-map"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.781766634116!2d79.96723180000001!3d6.9166746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2572d03bef887%3A0xf644162eb788327a!2spiriyanka%20hom!5e0!3m2!1sen!2slk!4v1773926071574!5m2!1sen!2slk"
                                    width="100%"
                                    height="100%"
                                    style={{ 
                                        border: 0, 
                                        filter: 'grayscale(0.1) contrast(1.1) brightness(1.1)',
                                        opacity: 1
                                    }} 
                                    allowFullScreen=""
                                    loading="lazy"
                                />
                                {/* Custom Pin Highlight */}
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
                                    <div style={{ width: '12px', height: '12px', background: '#CFF971', borderRadius: '50%', boxShadow: '0 0 15px #CFF971, 0 0 30px #CFF971' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                    support@carelink.lk
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                    +94 76 604 8602
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Bar: Copyright */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    padding: '1.5rem 0',
                    textAlign: 'center',
                    background: 'rgba(0,0,0,0.2)'
                }}>
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                        © 2026 CareLink Healthcare Management System. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
