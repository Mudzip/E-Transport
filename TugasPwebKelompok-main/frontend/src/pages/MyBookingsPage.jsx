import { useState, useEffect } from 'react';
import { fetchUserBookings } from '../services/api';
import { useUser } from '../hooks/useUser';

export default function MyBookingsPage({ onBack }) {
    const userId = useUser();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        fetchUserBookings(userId)
            .then(setBookings)
            .catch((err) => {
                console.error('Failed to fetch bookings:', err);
                setError('Failed to load bookings');
            })
            .finally(() => setLoading(false));
    }, [userId]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
                <button
                    className="btn btn-outline"
                    onClick={onBack}
                    style={{ marginRight: 'var(--space-4)' }}
                >
                    ← Back
                </button>
                <h1>My Bookings</h1>
            </div>

            {loading ? (
                <div className="loading" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                    <div className="spinner"></div>
                    <p>Loading your bookings...</p>
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', color: 'var(--error)' }}>
                    {error}
                </div>
            ) : bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-12)', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)' }}>
                    <span style={{ fontSize: '3rem', display: 'block', marginBottom: 'var(--space-4)' }}>🎫</span>
                    <h3>No bookings found</h3>
                    <p style={{ color: 'var(--gray-400)', marginBottom: 'var(--space-6)' }}>You haven't made any bookings yet.</p>
                    <button className="btn btn-primary" onClick={onBack}>Find Trains</button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {bookings.map((booking) => (
                        <div key={booking.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div className="badge badge-success" style={{ marginBottom: 'var(--space-2)' }}>CONFIRMED</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>
                                        Ordered on {formatDate(booking.createdAt)}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--accent-400)' }}>
                                        {formatPrice(booking.totalPrice)}
                                    </div>
                                    <div style={{ fontSize: '0.875rem' }}>{booking.className} Class</div>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                                    <span style={{ fontSize: '1.5rem' }}>🚆</span>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{booking.schedule.train.name}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>{booking.schedule.train.trainType}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{new Date(booking.schedule.departureTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>{booking.schedule.departureStation.name}</div>
                                    </div>
                                    <div style={{ flex: 1, borderTop: '2px dashed var(--gray-600)', margin: '0 var(--space-4)' }}></div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 700 }}>{new Date(booking.schedule.arrivalTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>{booking.schedule.arrivalStation.name}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
