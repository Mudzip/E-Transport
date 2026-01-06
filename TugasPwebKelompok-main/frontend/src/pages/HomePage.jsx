import { useState, useEffect } from 'react';
import { fetchStations } from '../services/api';

export default function HomePage({ onSearch }) {
    const [stations, setStations] = useState([]);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [loading, setLoading] = useState(true);
    const [activeMode, setActiveMode] = useState('krl'); // 'krl' | 'intercity'

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
            alert('Pilih stasiun asal dan tujuan');
            return;
        }
        onSearch({
            origin,
            destination,
            mode: activeMode,
            date: activeMode === 'intercity' ? date : null,
            passengers: activeMode === 'intercity' ? passengers : 1
        });
    };

    const today = new Date().toISOString().split('T')[0];

    // Popular KRL Routes
    const krlRoutes = [
        { from: 'Bogor', to: 'Jakarta Kota', line: 'Bogor Line', emoji: '🟢' },
        { from: 'Bekasi', to: 'Manggarai', line: 'Bekasi Line', emoji: '🔵' },
        { from: 'Tangerang', to: 'Duri', line: 'Tangerang Line', emoji: '🟤' },
        { from: 'Cikarang', to: 'Jakarta Kota', line: 'Cikarang Line', emoji: '🟡' },
    ];

    // Popular Intercity Routes
    const intercityRoutes = [
        { from: 'Gambir', to: 'Bandung', info: 'Argo Parahyangan', emoji: '🏔️', price: 'Rp 150rb+' },
        { from: 'Gambir', to: 'Yogyakarta', info: 'Taksaka / Argo Dwipangga', emoji: '🏛️', price: 'Rp 400rb+' },
        { from: 'Pasar Senen', to: 'Surabaya', info: 'Gumarang', emoji: '🌆', price: 'Rp 210rb+' },
        { from: 'Bandung', to: 'Solo Balapan', info: 'Lodaya', emoji: '🎭', price: 'Rp 220rb+' },
    ];

    // Filter stations based on active mode
    const filteredStations = stations.filter(s => {
        if (activeMode === 'krl') return s.stationType === 'KRL' || s.stationType === 'Both';
        return s.stationType === 'Intercity' || s.stationType === 'Both';
    });

    const activeRoutes = activeMode === 'krl' ? krlRoutes : intercityRoutes;

    return (
        <>
            <section className="hero">
                <h1>{activeMode === 'krl' ? '🚇 Jadwal KRL Commuter' : '🚄 Tiket Kereta Antar Kota'}</h1>
                <p>
                    {activeMode === 'krl'
                        ? 'Cek jadwal KRL Jabodetabek & Rangkasbitung real-time'
                        : 'Pesan tiket kereta api jarak jauh (Gambir, Senen, dll)'}
                </p>
            </section>

            <div className="container">
                <form className="search-box" onSubmit={handleSearch}>
                    {/* Mode Switcher as a subtle link */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-4)' }}>
                        <button
                            type="button"
                            className="text-btn"
                            onClick={() => {
                                const newMode = activeMode === 'krl' ? 'intercity' : 'krl';
                                setActiveMode(newMode);
                                setOrigin('');
                                setDestination('');
                            }}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--primary-400)',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                textDecoration: 'underline',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {activeMode === 'krl' ? '🎫 Pesan Tiket Antar Kota (Gambir/Senen) →' : '🚇 Cek Jadwal KRL Commuter →'}
                        </button>
                    </div>

                    <div className="station-inputs">
                        <div className="search-grid">
                            <div className="form-group">
                                <label className="form-label">
                                    {activeMode === 'krl' ? 'Stasiun Asal' : 'Keberangkatan'}
                                </label>
                                <select
                                    className="form-select"
                                    value={origin}
                                    onChange={(e) => setOrigin(e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="">Pilih stasiun</option>
                                    {filteredStations.map(station => (
                                        <option key={station.id} value={station.code}>
                                            {station.name} ({station.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    {activeMode === 'krl' ? 'Stasiun Tujuan' : 'Tujuan'}
                                </label>
                                <select
                                    className="form-select"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="">Pilih stasiun</option>
                                    {filteredStations.map(station => (
                                        <option key={station.id} value={station.code}>
                                            {station.name} ({station.code})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button type="button" className="swap-btn" onClick={handleSwap} title="Tukar stasiun">
                            ⇄
                        </button>
                    </div>

                    {/* Intercity Extra Fields */}
                    {activeMode === 'intercity' && (
                        <div className="search-row" style={{ marginTop: 'var(--space-6)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-4)' }}>
                            <div className="form-group">
                                <label className="form-label">Tanggal</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    min={today}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Penumpang</label>
                                <select
                                    className="form-select"
                                    value={passengers}
                                    onChange={(e) => setPassengers(Number(e.target.value))}
                                >
                                    {[1, 2, 3, 4].map(n => (
                                        <option key={n} value={n}>{n} Orang</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Kelas</label>
                                <select className="form-select">
                                    <option value="">Semua Kelas</option>
                                    <option value="Eksekutif">Eksekutif</option>
                                    <option value="Bisnis">Bisnis</option>
                                    <option value="Ekonomi">Ekonomi</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn btn-accent search-btn" style={{ marginTop: 'var(--space-6)' }}>
                        {activeMode === 'krl' ? '🔍 Cari Jadwal KRL' : '🎫 Cari Tiket Kereta'}
                    </button>
                </form>

                {/* Popular Routes Section (Dynamic) */}
                <section style={{ marginTop: 'var(--space-8)', marginBottom: 'var(--space-12)' }}>
                    <h2 style={{ marginBottom: 'var(--space-6)' }}>
                        {activeMode === 'krl' ? 'Rute KRL Populer' : 'Rute Populer Antar Kota'}
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                        {activeRoutes.map((route, i) => (
                            <div
                                key={i}
                                className="card"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    const originStation = stations.find(s => s.name.includes(route.from));
                                    const destStation = stations.find(s => s.name.includes(route.to));
                                    if (originStation) setOrigin(originStation.code);
                                    if (destStation) setDestination(destStation.code);
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                    <span style={{ fontSize: '2rem' }}>{route.emoji}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, color: 'var(--gray-100)' }}>
                                            {route.from} → {route.to}
                                        </div>
                                        <div style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                                            {activeMode === 'krl' ? route.line : route.info}
                                        </div>
                                    </div>
                                    {activeMode === 'krl' ? (
                                        <div className="badge badge-primary">KRL</div>
                                    ) : (
                                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-400)' }}>
                                            {route.price}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
