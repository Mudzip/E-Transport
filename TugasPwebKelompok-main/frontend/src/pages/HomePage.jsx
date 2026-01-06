import { useState, useEffect } from 'react';
import { fetchStations, searchTrains } from '../services/api';

export default function HomePage({ onSearch }) {
    const [stations, setStations] = useState([]);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStations()
            .then(setStations)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSwap = () => {
        const temp = origin;
        setOrigin(destination);
        setDestination(temp);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!origin || !destination) {
            alert('Please select origin and destination stations');
            return;
        }
        onSearch({ origin, destination, date, passengers });
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            <section className="hero">
                <h1>🚆 E-Transport</h1>
                <p>Book train tickets easily. Fast, secure, and reliable transportation across Indonesia.</p>
            </section>

            <div className="container">
                <form className="search-box" onSubmit={handleSearch}>
                    <div className="station-inputs">
                        <div className="search-grid">
                            <div className="form-group">
                                <label className="form-label">From</label>
                                <select
                                    className="form-select"
                                    value={origin}
                                    onChange={(e) => setOrigin(e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="">Select departure station</option>
                                    {stations.map(station => (
                                        <option key={station.id} value={station.code}>
                                            {station.name} ({station.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">To</label>
                                <select
                                    className="form-select"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="">Select arrival station</option>
                                    {stations.map(station => (
                                        <option key={station.id} value={station.code}>
                                            {station.name} ({station.code})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button type="button" className="swap-btn" onClick={handleSwap} title="Swap stations">
                            ⇄
                        </button>
                    </div>

                    <div className="search-row">
                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={today}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Passengers</label>
                            <select
                                className="form-select"
                                value={passengers}
                                onChange={(e) => setPassengers(Number(e.target.value))}
                            >
                                {[1, 2, 3, 4, 5, 6].map(n => (
                                    <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Train Type</label>
                            <select className="form-select">
                                <option value="">All Types</option>
                                <option value="Intercity">Intercity</option>
                                <option value="KRL">KRL Commuter</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-accent search-btn">
                        🔍 Search Trains
                    </button>
                </form>

                {/* Featured Routes */}
                <section style={{ marginTop: 'var(--space-8)', marginBottom: 'var(--space-12)' }}>
                    <h2 style={{ marginBottom: 'var(--space-6)' }}>Popular Routes</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                        {[
                            { from: 'Jakarta', to: 'Bandung', price: 'Rp 150.000', emoji: '🏔️' },
                            { from: 'Jakarta', to: 'Yogyakarta', price: 'Rp 350.000', emoji: '🏛️' },
                            { from: 'Jakarta', to: 'Surabaya', price: 'Rp 450.000', emoji: '🌆' },
                            { from: 'Bandung', to: 'Solo', price: 'Rp 280.000', emoji: '🎭' },
                        ].map((route, i) => (
                            <div key={i} className="card" style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                    <span style={{ fontSize: '2rem' }}>{route.emoji}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>
                                            {route.from} → {route.to}
                                        </div>
                                        <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                                            Starting from
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 700, color: 'var(--accent-500)' }}>
                                        {route.price}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
