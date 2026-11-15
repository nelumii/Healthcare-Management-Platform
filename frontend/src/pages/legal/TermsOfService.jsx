import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
    return (
        <div style={{ minHeight: '100vh', background: '#0a191c', color: '#fff', padding: '4rem 5%' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Link to="/" style={{ color: '#CFF971', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Back to Home
                </Link>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Terms of Service</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '2rem' }}>
                    Welcome to CareLink. Please read these terms and conditions carefully as they govern your use of the platform.
                </p>
                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.2rem', color: '#CFF971' }}>1. Platform Use</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        The platform provides healthcare management features, including appointment booking, lab results viewing, and prescription storage. It is not intended as an emergency response service.
                    </p>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.2rem', color: '#CFF971' }}>2. User Responsibilities</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        You agree to provide accurate information when registering and using the platform and to keep your credentials confidential. You are responsible for all activity on your account.
                    </p>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.2rem', color: '#CFF971' }}>3. Professional Services</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        Doctors, laboratories, and pharmacies on CareLink are independent professionals. While we verify credentials, CareLink does not guarantee results or medical outcomes from these third-party providers.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;
