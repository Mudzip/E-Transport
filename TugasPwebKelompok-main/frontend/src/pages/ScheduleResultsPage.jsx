import { useState, useEffect } from 'react';
import { searchSchedules } from '../services/api';
import TrainCard from '../components/TrainCard';

export default function ScheduleResultsPage({ searchParams, onBack, onSelectTrain }) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!searchParams?.origin || !searchParams?.destination) return;

        setLoading(true);
        setError(null);

        searchSchedules(searchParams.origin, searchParams.destination)
            .then(data => {
                // Map the backend response to the format expected by TrainCard
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
                setResults(mapped);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load schedules. Please try again.');
            })
            .finally(() => setLoading(false));
    }, [searchParams]);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Any date';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
                            ← Back to Search
                        </button>
                        <h2>
                            {searchParams.origin} → {searchParams.destination}
                        </h2>
                        <p className="results-count">
                            {formatDate(searchParams.date)} • {searchParams.passengers} passenger{searchParams.passengers > 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {loading && (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Finding the best trains for you...</p>
                    </div>
                )}

                {error && (
                    <div className="empty-state">
                        <div className="empty-state-icon">⚠️</div>
                        <h3>{error}</h3>
                        <button className="btn btn-primary" onClick={onBack} style={{ marginTop: 'var(--space-4)' }}>
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && results.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">🚆</div>
                        <h3>No trains found</h3>
                        <p style={{ color: 'var(--gray-500)', marginTop: 'var(--space-2)' }}>
                            Try searching for a different route or date
                        </p>
                        <button className="btn btn-primary" onClick={onBack} style={{ marginTop: 'var(--space-4)' }}>
                            Modify Search
                        </button>
                    </div>
                )}

                {!loading && !error && results.length > 0 && (
                    <>
                        <p style={{ marginBottom: 'var(--space-4)', color: 'var(--gray-600)' }}>
                            Found {results.length} train{results.length > 1 ? 's' : ''} available
                        </p>
                        <div className="results-list">
                            {results.map((item, index) => (
                                <TrainCard
                                    key={index}
                                    schedule={item.schedule}
                                    train={item.train}
                                    onSelect={onSelectTrain}
                                />
                            ))}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
