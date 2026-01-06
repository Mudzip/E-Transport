import { useState, useEffect } from 'react';
import { fetchTrainById } from '../services/api';

export default function BookingModal({ data, passengers, onClose, onConfirm }) {
    const { schedule, train: initialTrain } = data;
    const [train, setTrain] = useState(initialTrain);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isBooking, setIsBooking] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch full train details including all classes
        fetchTrainById(initialTrain.id)
            .then(fullTrain => {
                setTrain(fullTrain);
                if (fullTrain.classes?.length > 0) {
                    setSelectedClass(fullTrain.classes[0]);
                }
            })
            .catch(err => {
                console.error('Failed to fetch train details:', err);
                // Fall back to initial train data
                if (initialTrain.classes?.length > 0) {
                    setSelectedClass(initialTrain.classes[0]);
                }
            })
            .finally(() => setLoading(false));
    }, [initialTrain.id]);

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const calculateDuration = (dep, arr) => {
        const start = new Date(dep);
        const end = new Date(arr);
        const diff = Math.abs(end - start);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const totalPrice = (selectedClass?.price || 0) * passengers;

    const handleBook = async () => {
        if (!selectedClass) return;

        setIsBooking(true);

        // Simulate booking
        await new Promise(resolve => setTimeout(resolve, 1500));

        onConfirm({
            train,
            schedule,
            selectedClass,
            passengers,
            totalPrice
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Book Your Trip</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div className="loading" style={{ padding: 'var(--space-8)' }}>
                            <div className="spinner"></div>
                            <p>Loading train details...</p>
                        </div>
                    ) : (
                        <>
                            {/* Train Info */}
                            <div style={{ marginBottom: 'var(--space-6)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                                    <span style={{ fontSize: '1.5rem' }}>🚆</span>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>{train.name}</div>
                                        <span className={`badge ${train.trainType === 'KRL' ? 'badge-primary' : 'badge-accent'}`}>
                                            {train.trainType}
                                        </span>
                                    </div>
                                </div>

                                <div className="card" style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 'var(--space-4)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatTime(schedule.departureTime)}</div>
                                            <div style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                                                {schedule.departureStation?.name || schedule.departureStation?.code}
                                            </div>
                                        </div>

                                        <div style={{ flex: 1, textAlign: 'center', padding: '0 var(--space-4)' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                                                {calculateDuration(schedule.departureTime, schedule.arrivalTime)}
                                            </div>
                                            <div style={{ height: '2px', background: 'var(--primary-600)', margin: 'var(--space-2) 0', borderRadius: '2px' }}></div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--primary-400)' }}>Direct</div>
                                        </div>

                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatTime(schedule.arrivalTime)}</div>
                                            <div style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                                                {schedule.arrivalStation?.name || schedule.arrivalStation?.code}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Class Selection */}
                            <div>
                                <h4 style={{ marginBottom: 'var(--space-3)' }}>Select Class</h4>
                                <div className="class-options">
                                    {train.classes?.map((cls) => (
                                        <div
                                            key={cls.id}
                                            className={`class-option ${selectedClass?.id === cls.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedClass(cls)}
                                        >
                                            <div>
                                                <div className="class-name">{cls.className}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                                                    {cls.className === 'Eksekutif' && 'Spacious seats, AC, Meal included'}
                                                    {cls.className === 'Bisnis' && 'Comfortable seats, AC'}
                                                    {cls.className === 'Ekonomi' && 'Standard seats'}
                                                </div>
                                            </div>
                                            <div className="class-price">{formatPrice(cls.price)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            <div style={{
                                marginTop: 'var(--space-6)',
                                padding: 'var(--space-4)',
                                background: 'rgba(6, 182, 212, 0.1)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid rgba(6, 182, 212, 0.2)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                    <span style={{ color: 'var(--gray-300)' }}>{passengers} Passenger{passengers > 1 ? 's' : ''} × {formatPrice(selectedClass?.price || 0)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.25rem' }}>
                                    <span>Total</span>
                                    <span style={{ color: 'var(--accent-400)' }}>{formatPrice(totalPrice)}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="modal-footer">
                    <button
                        className="btn btn-accent"
                        style={{ width: '100%' }}
                        onClick={handleBook}
                        disabled={!selectedClass || isBooking || loading}
                    >
                        {isBooking ? 'Processing...' : loading ? 'Loading...' : `Book Now - ${formatPrice(totalPrice)}`}
                    </button>
                </div>
            </div>
        </div>
    );
}
