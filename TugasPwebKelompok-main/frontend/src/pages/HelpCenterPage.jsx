import React, { useState } from 'react';

const HelpCenterPage = ({ onBack }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/syllabus/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '3rem', paddingTop: '2rem' }}>
            <button onClick={onBack} className="btn btn-outline" style={{ marginBottom: '2rem' }}>&larr; Back</button>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '4rem', alignItems: 'start' }}>
                <div>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.1, background: 'linear-gradient(135deg, #fff 30%, var(--primary-300) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        How can we help you today?
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: 'var(--gray-300)', marginBottom: '3rem', lineHeight: 1.7 }}>
                        We're here to help and answer any question you might have. We look forward to hearing from you.
                    </p>

                    <div style={{ display: 'grid', gap: '2rem' }}>
                        <div>
                            <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary-300)' }}>Customer Support</h4>
                            <p style={{ color: 'var(--gray-400)' }}>support@etransport.com</p>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary-300)' }}>Phone</h4>
                            <p style={{ color: 'var(--gray-400)' }}>+62 812 3456 7890</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginTop: 0, marginBottom: '2rem' }}>Send us a message</h3>

                    {status === 'success' && (
                        <div className="badge badge-success" style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
                            Message sent successfully! We'll get back to you soon.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="form-input"
                                placeholder="How can we help?"
                                style={{ resize: 'vertical' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
            {/* Responsive styles override */}
            <style>{`
                @media (max-width: 768px) {
                    div[style*="grid-template-columns"] {
                        grid-template-columns: 1fr !important;
                        gap: 3rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default HelpCenterPage;
