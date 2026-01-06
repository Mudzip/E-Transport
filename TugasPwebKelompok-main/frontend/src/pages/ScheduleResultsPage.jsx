import { useState, useEffect } from 'react';
import { searchSchedules } from '../services/api';
import TrainCard from '../components/TrainCard';
import KRLCard from '../components/KRLCard';
import RouteMapModal from '../components/RouteMapModal';

export default function ScheduleResultsPage({ searchParams, onBack, onSelectTrain }) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [routeMapData, setRouteMapData] = useState(null);

    const isKRLMode = searchParams?.mode === 'krl';

    useEffect(() => {
        if (!searchParams?.origin || !searchParams?.destination) return;

        setLoading(true);
        setError(null);

        searchSchedules(searchParams.origin, searchParams.destination)
            .then(data => {
                // Map the backend response
                const mapped = data.map(item => ({
                    schedule: {
                        id: item.id,
                        departureTime: item.departureTime,
                        arrivalTime: item.arrivalTime,
                        departureStation: item.departureStation,
                        arrivalStation: item.arrivalStation
                    },
                    train: {
                        id: item.train.id,
                        name: item.train.name,
                        trainType: item.train.trainType,
                        classes: [{
                            id: 1,
                            className: 'Ekonomi',
                            price: item.train.lowestPrice
                        }]
                    }
                }));

                // Sort by departure time
                mapped.sort((a, b) => new Date(a.schedule.departureTime) - new Date(b.schedule.departureTime));

                // Filter for KRL if in KRL mode
                const filtered = isKRLMode
                    ? mapped.filter(item => item.train.trainType === 'KRL')
                    : mapped;

                setResults(filtered);
            })
            .catch(err => {
                console.error(err);
                setError('Gagal memuat jadwal. Silakan coba lagi.');
            })
            .finally(() => setLoading(false));
    }, [searchParams, isKRLMode]);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Hari ini';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Find the next departing train (first one with departure time in the future)
    const getNextTrainIndex = () => {
        const now = new Date();
        return results.findIndex(item => new Date(item.schedule.departureTime) > now);
    };

    const nextTrainIndex = getNextTrainIndex();

    const handleViewRoute = (data) => {
        setRouteMapData(data);
    };

    return (
        <div className="container">
            <section className="results-section">
                <div className="results-header">
                    <div>
                        <button
                            className="btn btn-outline"
                            onClick={onBack}
                            style={{ marginBottom: 'var(--space-4)' }}
                        >
                            ← Kembali
                        </button>
                        <h2>
                            {searchParams.origin} → {searchParams.destination}
                        </h2>
                        <p className="results-count">
                            {isKRLMode ? 'Jadwal KRL' : formatDate(searchParams.date)}
                            {!isKRLMode && ` • ${searchParams.passengers} penumpang`}
                        </p>
                    </div>
                </div>

                {loading && (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>{isKRLMode ? 'Mencari jadwal KRL...' : 'Mencari kereta terbaik...'}</p>
                    </div>
                )}

                {error && (
                    <div className="empty-state">
                        <div className="empty-state-icon">⚠️</div>
                        <h3>{error}</h3>
                        <button className="btn btn-primary" onClick={onBack} style={{ marginTop: 'var(--space-4)' }}>
                            Coba Lagi
                        </button>
                    </div>
                )}

                {!loading && !error && results.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">{isKRLMode ? '🚇' : '🚆'}</div>
                        <h3>Tidak ada {isKRLMode ? 'jadwal KRL' : 'kereta'} ditemukan</h3>
                        <p style={{ color: 'var(--gray-400)', marginTop: 'var(--space-2)' }}>
                            Coba cari rute atau tanggal lain
                        </p>
                        <button className="btn btn-primary" onClick={onBack} style={{ marginTop: 'var(--space-4)' }}>
                            Ubah Pencarian
                        </button>
                    </div>
                )}

                {!loading && !error && results.length > 0 && (
                    <>
                        <div className="results-summary">
                            <p style={{ marginBottom: 'var(--space-4)', color: 'var(--gray-300)' }}>
                                Ditemukan {results.length} {isKRLMode ? 'jadwal' : 'kereta'}
                            </p>
                            {isKRLMode && nextTrainIndex >= 0 && (
                                <div className="next-train-info">
                                    <span className="pulse-dot-small"></span>
                                    <span>Kereta berikutnya berangkat segera</span>
                                </div>
                            )}
                        </div>

                        <div className="results-list">
                            {results.map((item, index) => (
                                isKRLMode || item.train.trainType === 'KRL' ? (
                                    <KRLCard
                                        key={index}
                                        schedule={item.schedule}
                                        train={item.train}
                                        isNextTrain={index === nextTrainIndex}
                                        onViewRoute={handleViewRoute}
                                    />
                                ) : (
                                    <TrainCard
                                        key={index}
                                        schedule={item.schedule}
                                        train={item.train}
                                        onSelect={onSelectTrain}
                                    />
                                )
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* Route Map Modal */}
            <RouteMapModal
                isOpen={!!routeMapData}
                onClose={() => setRouteMapData(null)}
                schedule={routeMapData?.schedule}
                train={routeMapData?.train}
            />
        </div>
    );
}
