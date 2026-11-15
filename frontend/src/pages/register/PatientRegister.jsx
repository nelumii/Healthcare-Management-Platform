import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

/* ─── Step Indicator ─────────────────────────────────── */
function StepIndicator({ current, steps }) {
    return (
        <div className="step-indicator">
            {steps.map((label, i) => (
                <React.Fragment key={i}>
                    <div className="step-wrapper">
                        <div className={`step-circle ${i < current ? 'done' : i === current ? 'active' : ''}`}>
                            {i < current ? '✓' : i + 1}
                        </div>
                        <span className={`step-label ${i === current ? 'active' : i < current ? 'done' : ''}`}>
                            {label}
                        </span>
                    </div>
                    {i < steps.length - 1 && (
                        <div className={`step-line ${i < current ? 'done' : ''}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

/* ─── Profile Picture Upload ───────────────────────── */
function ProfilePictureUpload({ image, onChange }) {
    const fileRef = React.useRef();
    const [preview, setPreview] = React.useState(null);

    React.useEffect(() => {
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(image);
        } else {
            setPreview(null);
        }
    }, [image]);

    return (
        <div className="form-group" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div 
                onClick={() => fileRef.current.click()}
                style={{
                    width: '110px', height: '110px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '2px dashed rgba(207, 249, 113, 0.4)',
                    margin: '0 auto 1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', overflow: 'hidden', position: 'relative',
                    transition: 'all 0.3s ease',
                    boxShadow: preview ? '0 10px 25px rgba(0,0,0,0.3)' : 'none'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = '#CFF971'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(207, 249, 113, 0.4)'}
            >
                {preview ? (
                    <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '4px' }}>📸</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#CFF971' }}>ADD PHOTO</div>
                    </div>
                )}
                {preview && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: 0, transition: 'opacity 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.opacity = 1}
                    onMouseOut={e => e.currentTarget.style.opacity = 0}
                    >
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#fff' }}>CHANGE</span>
                    </div>
                )}
            </div>
            <input type="file" ref={fileRef} style={{ display: 'none' }} accept="image/*" onChange={e => {
                const file = e.target.files[0];
                if (file) onChange(file);
            }} />
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                Upload a professional profile photo (Optional)
            </div>
        </div>
    );
}

/* ─── Step 1: Account & Security ─────────────────────── */
function Step1({ data, onChange, errors, profilePic, onProfilePicChange }) {
    return (
        <>
            <div className="section-title">🔐 Account & Security</div>
            <ProfilePictureUpload image={profilePic} onChange={onProfilePicChange} />
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">First Name <span className="required">*</span></label>
                    <input className={`form-input ${errors.firstName ? 'error' : ''}`} placeholder="Kamal" name="firstName" value={data.firstName} onChange={onChange} />
                    {errors.firstName && <span className="form-error">⚠ {errors.firstName}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Last Name <span className="required">*</span></label>
                    <input className={`form-input ${errors.lastName ? 'error' : ''}`} placeholder="Perera" name="lastName" value={data.lastName} onChange={onChange} />
                    {errors.lastName && <span className="form-error">⚠ {errors.lastName}</span>}
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">Email Address <span className="required">*</span></label>
                <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="kamal@email.com" name="email" value={data.email} onChange={onChange} />
                {errors.email && <span className="form-error">⚠ {errors.email}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Phone Number <span className="required">*</span></label>
                <input type="tel" className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="+94 77 123 4567" name="phone" value={data.phone} onChange={onChange} />
                {errors.phone && <span className="form-error">⚠ {errors.phone}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">National ID / Passport Number <span className="required">*</span></label>
                <input className={`form-input ${errors.nationalId ? 'error' : ''}`} placeholder="199012345678" name="nationalId" value={data.nationalId} onChange={onChange} />
                {errors.nationalId && <span className="form-error">⚠ {errors.nationalId}</span>}
            </div>
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">Password <span className="required">*</span></label>
                    <input type="password" className={`form-input ${errors.password ? 'error' : ''}`} placeholder="••••••••" name="password" value={data.password} onChange={onChange} />
                    {errors.password && <span className="form-error">⚠ {errors.password}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Confirm Password <span className="required">*</span></label>
                    <input type="password" className={`form-input ${errors.confirmPassword ? 'error' : ''}`} placeholder="••••••••" name="confirmPassword" value={data.confirmPassword} onChange={onChange} />
                    {errors.confirmPassword && <span className="form-error">⚠ {errors.confirmPassword}</span>}
                </div>
            </div>
            <div className="form-group" style={{ 
                background: 'rgba(207, 249, 113, 0.05)', 
                padding: '1.25rem', 
                borderRadius: '16px', 
                border: '1.5px solid rgba(207, 249, 113, 0.2)',
                marginTop: '1.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '40px', height: '40px', background: 'rgba(207, 249, 113, 0.1)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CFF971'
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, color: '#CFF971', fontSize: '0.95rem' }}>
                            Mandatory 2-Step Verification
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.2rem', lineHeight: 1.4 }}>
                            For your protection, an email OTP is required to activate and access your new CareLink account.
                        </div>
                    </div>
                    <div style={{ color: '#CFF971', fontSize: '0.7rem', fontWeight: 900, background: 'rgba(207, 249, 113, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '20px', border: '1px solid rgba(207, 249, 113, 0.3)' }}>
                        REQUIRED
                    </div>
                </div>
            </div>
        </>
    );
}

/* ─── Step 2: Demographics ───────────────────────────── */
function Step2({ data, onChange, errors }) {
    return (
        <>
            <div className="section-title">👤 Basic Demographics</div>
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">Date of Birth <span className="required">*</span></label>
                    <input type="date" className={`form-input ${errors.dob ? 'error' : ''}`} name="dob" value={data.dob} onChange={onChange} max={new Date().toISOString().split('T')[0]} />
                    {errors.dob && <span className="form-error">⚠ {errors.dob}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Gender / Biological Sex <span className="required">*</span></label>
                    <select className={`form-select ${errors.gender ? 'error' : ''}`} name="gender" value={data.gender} onChange={onChange}>
                        <option value="">Select gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other / Prefer not to say</option>
                    </select>
                    {errors.gender && <span className="form-error">⚠ {errors.gender}</span>}
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">Residential Address <span className="required">*</span></label>
                <textarea
                    className={`form-input ${errors.address ? 'error' : ''}`}
                    placeholder="123 Main Street, Colombo 03, Sri Lanka"
                    name="address"
                    value={data.address}
                    onChange={onChange}
                    rows={3}
                    style={{ resize: 'vertical' }}
                />
                {errors.address && <span className="form-error">⚠ {errors.address}</span>}
            </div>
        </>
    );
}

/* ─── Step 3: Medical Baseline ───────────────────────── */
function Step3({ data, onChange, errors }) {
    return (
        <>
            <div className="section-title">🩺 Initial Medical Baseline</div>
            <div className="form-group">
                <label className="form-label">Blood Group <span className="required">*</span></label>
                <select className={`form-select ${errors.bloodGroup ? 'error' : ''}`} name="bloodGroup" value={data.bloodGroup} onChange={onChange}>
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                </select>
                {errors.bloodGroup && <span className="form-error">⚠ {errors.bloodGroup}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Known Allergies</label>
                <input
                    className="form-input"
                    placeholder="e.g. Penicillin, Peanuts (leave blank if none)"
                    name="allergies"
                    value={data.allergies}
                    onChange={onChange}
                />
            </div>
            <div className="section-title" style={{ marginTop: '1rem' }}>🆘 Emergency Contact</div>
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">Contact Name <span className="required">*</span></label>
                    <input className={`form-input ${errors.emergencyContactName ? 'error' : ''}`} placeholder="Saman Perera" name="emergencyContactName" value={data.emergencyContactName} onChange={onChange} />
                    {errors.emergencyContactName && <span className="form-error">⚠ {errors.emergencyContactName}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Contact Phone <span className="required">*</span></label>
                    <input type="tel" className={`form-input ${errors.emergencyContactPhone ? 'error' : ''}`} placeholder="+94 71 987 6543" name="emergencyContactPhone" value={data.emergencyContactPhone} onChange={onChange} />
                    {errors.emergencyContactPhone && <span className="form-error">⚠ {errors.emergencyContactPhone}</span>}
                </div>
            </div>
        </>
    );
}

/* ─── MAIN COMPONENT ─────────────────────────────────── */
const STEPS = ['Account', 'Demographics', 'Medical Info'];

const INITIAL = {
    firstName: '', lastName: '', email: '', phone: '', nationalId: '',
    password: '', confirmPassword: '',
    dob: '', gender: '', address: '',
    bloodGroup: '', allergies: '', emergencyContactName: '', emergencyContactPhone: '',
    twoFactorEnabled: true
};

export default function PatientRegister() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [form, setForm] = useState(INITIAL);
    const [profilePic, setProfilePic] = useState(null);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        let { name, value } = e.target;

        // 1. Names: Filter out numbers
        if (name === 'firstName' || name === 'lastName' || name === 'emergencyContactName') {
            value = value.replace(/[0-9]/g, '');
        }

        // 2. Phone: Filter non-numbers and limit digits to 10
        if (name === 'phone' || name === 'emergencyContactPhone') {
            value = value.replace(/\D/g, '').slice(0, 10);
        }

        // 3. National ID: Limit to 13 chars, only numbers and 'v'/'V'
        if (name === 'nationalId') {
            value = value.replace(/[^0-9vV]/g, '').slice(0, 13);
        }

        setForm({ ...form, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const validateStep = () => {
        const e = {};
        if (step === 0) {
            if (!form.firstName.trim()) e.firstName = 'First name is required';
            if (!form.lastName.trim()) e.lastName = 'Last name is required';
            if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
            
            if (!form.phone.trim()) {
                e.phone = 'Phone number is required';
            } else if (form.phone.length !== 10) {
                e.phone = 'Phone number must be exactly 10 digits';
            }

            if (!form.nationalId.trim()) {
                e.nationalId = 'National ID is required';
            } else if (form.nationalId.length < 9) { // Basic sanity check for min length
                e.nationalId = 'National ID is too short';
            } else if (form.nationalId.length > 13) {
                e.nationalId = 'Max 13 characters allowed';
            }

            if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
            if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
        }
        if (step === 1) {
            if (!form.dob) {
                e.dob = 'Date of birth is required';
            } else {
                const today = new Date();
                const birth = new Date(form.dob);
                const age = today.getFullYear() - birth.getFullYear()
                    - (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
                if (age < 18) e.dob = 'You must be at least 18 years old to register';
            }
            if (!form.gender) e.gender = 'Gender is required';
            if (!form.address.trim()) e.address = 'Address is required';
        }
        if (step === 2) {
            if (!form.bloodGroup) e.bloodGroup = 'Blood group is required';
            if (!form.emergencyContactName.trim()) e.emergencyContactName = 'Emergency contact name is required';
            if (!form.emergencyContactPhone.trim()) e.emergencyContactPhone = 'Emergency contact phone is required';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const nextStep = () => { if (validateStep()) setStep((s) => s + 1); };
    const prevStep = () => setStep((s) => s - 1);

    const handleSubmit = async () => {
        if (!validateStep()) return;
        setLoading(true);
        setApiError('');
        try {
            const formData = new FormData();
            const requestData = {
                ...form,
                username: form.email,
                role: 'PATIENT',
            };
            
            // Append the JSON part as a blob with correct content type
            formData.append('request', new Blob([JSON.stringify(requestData)], { type: 'application/json' }));
            
            // Append files if present
            if (profilePic) {
                formData.append('profilePic', profilePic);
            }

            const res = await api.post('/v1/auth/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (res.data.requires2fa) {
                navigate('/verify-otp', { state: { username: form.email } });
                return;
            }
            
            setSuccess(true);
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed. Please try again.';
            setApiError(msg);
            const step1Fields = ['email', 'phone', 'national id'];
            if (step1Fields.some((f) => msg.toLowerCase().includes(f))) {
                setStep(0);
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        const hasPendingBooking = !!sessionStorage.getItem('cl_pending_booking') || !!sessionStorage.getItem('cl_pending_lab_booking');
        return (
            <div className="auth-page">
                <div className="auth-card animate-in" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                    {/* Glowing Shield Icon */}
                    <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 2rem' }}>
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'radial-gradient(circle, rgba(207,249,113,0.15) 0%, transparent 70%)',
                            borderRadius: '50%', transform: 'scale(1.8)'
                        }} />
                        <div style={{
                            width: '100px', height: '100px',
                            background: 'rgba(207,249,113,0.08)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(207,249,113,0.25)',
                            position: 'relative', zIndex: 1
                        }}>
                            <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="#CFF971" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(207,249,113,0.5))' }}>
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <path d="M9 12l2 2 4-4" strokeWidth="2.5" />
                            </svg>
                        </div>
                    </div>

                    <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', letterSpacing: '-0.01em' }}>Registration Successful!</h2>
                    
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 2.5rem' }}>
                        Your patient account has been created successfully. <br />
                        {hasPendingBooking 
                            ? 'Please sign in to complete your pending appointment booking.' 
                            : 'You can now sign in to start managing your healthcare journey.'}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
                        <button className="btn btn-primary" onClick={() => navigate('/login')} style={{ fontSize: '1.05rem', padding: '1rem', fontWeight: 700, boxShadow: '0 8px 15px rgba(207,249,113,0.2)' }}>
                            {hasPendingBooking ? '🔑 Sign In & Complete' : 'Go to Sign In'}
                        </button>
                        <button className="btn btn-ghost" onClick={() => navigate('/')} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                            Back to Homepage
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card wide animate-in">
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <Link to="/register" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '1.2rem' }}>←</Link>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <div className="auth-logo" style={{ marginBottom: 0 }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                            <span style={{ fontSize: '1.1rem' }}>Patient Registration</span>
                        </div>
                    </Link>
                </div>

                <StepIndicator current={step} steps={STEPS} />

                {apiError && <div className="alert alert-error">⚠ {apiError}</div>}

                {/* Form Steps */}
                <div className="animate-in" key={step}>
                    {step === 0 && <Step1 data={form} onChange={handleChange} errors={errors} profilePic={profilePic} onProfilePicChange={setProfilePic} />}
                    {step === 1 && <Step2 data={form} onChange={handleChange} errors={errors} />}
                    {step === 2 && <Step3 data={form} onChange={handleChange} errors={errors} />}
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                    {step > 0 && (
                        <button className="btn btn-outline" onClick={prevStep} style={{ flex: 1 }}>
                            ← Back
                        </button>
                    )}
                    {step < 2 ? (
                        <button className="btn btn-primary" onClick={nextStep} style={{ flex: 2 }}>
                            Continue →
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 2 }}>
                            {loading ? <><div className="spinner" /> Creating Account...</> : '🏥 Create Patient Account'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
