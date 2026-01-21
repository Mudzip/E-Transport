import React, { useState, useEffect } from 'react';
import StarRating from '../components/StarRating';

const ReviewsPage = ({ onBack }) => {
    const [entries, setEntries] = useState([]);
    const [formData, setFormData] = useState({ name: '', message: '', rating: 5 });
    const [loading, setLoading] = useState(true);

    const fetchEntries = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/syllabus/guestbook`);
            if (res.ok) {
                const data = await res.json();
                setEntries(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRatingChange = (rating) => {
        setFormData({ ...formData, rating });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/syllabus/guestbook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setFormData({ name: '', message: '', rating: 5 });
                fetchEntries(); // Refresh list
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '3rem', paddingTop: '2rem', maxWidth: '900px' }}>
            <button onClick={onBack} className="btn btn-outline" style={{ marginBottom: '2rem' }}>&larr; Back</button>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #fff 30%, var(--primary-300) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Travel Reviews
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--gray-300)' }}>
                    What other travelers say about E-Transport.
                </p>
            </div>

            {/* Form */}
            <div className="card" style={{ marginBottom: '3rem' }}>
                <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Share your experience</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '1.5rem', alignItems: 'start' }}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--gray-400)', fontWeight: 500 }}>Rating</span>
                            <StarRating value={formData.rating} onChange={handleRatingChange} />
                        </div>
                    </div>

                    <div className="form-group">
                        <textarea
                            name="message"
                            placeholder="Tell us about your trip..."
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="3"
                            className="form-input"
                            style={{ resize: 'vertical' }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary">Submit Review</button>
                    </div>
                </form>
            </div>

            {/* List */}
            <h3 style={{ marginBottom: '1.5rem', paddingLeft: '0.5rem', borderLeft: '4px solid var(--primary-500)', lineHeight: '1' }}>Recent Reviews</h3>
            {loading ? (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading reviews...</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {entries.length === 0 && (
                        <div className="card" style={{ textAlign: 'center', color: 'var(--gray-400)' }}>
                            No reviews yet. Be the first!
                        </div>
                    )}
                    {entries.map(entry => (
                        <div key={entry.id} className="card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1.25rem',
                                        boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)'
                                    }}>
                                        {entry.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--gray-50)' }}>{entry.name}</div>
                                        <StarRating value={entry.rating || 5} readOnly={true} />
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', height: 'fit-content' }}>
                                    {new Date(entry.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>
                            <p style={{ margin: 0, color: 'var(--gray-300)', lineHeight: 1.7, fontSize: '1rem' }}>"{entry.message}"</p>
                        </div>
                    ))}
                </div>
            )}
            <style>{`
                @media (max-width: 640px) {
                    div[style*="grid-template-columns"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ReviewsPage;
