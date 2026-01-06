export default function KRLCard({ schedule, train, isNextTrain = false, onViewRoute }) {
    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const calculateDuration = (dep, arr) => {
        const start = new Date(dep);
        const end = new Date(arr);
        const diff = Math.abs(end - start);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (hours === 0) return `${minutes} menit`;
        return `${hours}j ${minutes}m`;
    };

    const getTimeUntilDeparture = (depTime) => {
        const now = new Date();
        const departure = new Date(depTime);
        const diff = departure - now;
        if (diff < 0) return 'Sudah berangkat';
        const minutes = Math.floor(diff / (1000 * 60));
        if (minutes < 60) return `${minutes} menit lagi`;
        const hours = Math.floor(minutes / 60);
        return `${hours}j ${minutes % 60}m lagi`;
    };

    // Mock transit data (number of stops)
    const estimatedStops = Math.floor(Math.random() * 8) + 3;

    return (
        <div className={`krl-card ${isNextTrain ? 'next-train' : ''}`}>
            {isNextTrain && (
                <div className="next-train-badge">
                    <span className="pulse-dot"></span>
                    Berangkat Segera
                </div>
            )}

            <div className="krl-card-content">
                <div className="krl-time-section">
                    <div className="krl-departure">
                        <div className="krl-time-large">{formatTime(schedule.departureTime)}</div>
                        <div className="krl-station">{schedule.departureStation?.name || schedule.departureStation?.code}</div>
                    </div>

                    <div className="krl-journey">
                        <div className="krl-duration">{calculateDuration(schedule.departureTime, schedule.arrivalTime)}</div>
                        <div className="krl-line">
                            <div className="krl-dot start"></div>
                            <div className="krl-track"></div>
                            <div className="krl-dot end"></div>
                        </div>
                        <div className="krl-stops">{estimatedStops} pemberhentian</div>
                    </div>

                    <div className="krl-arrival">
                        <div className="krl-time-large">{formatTime(schedule.arrivalTime)}</div>
                        <div className="krl-station">{schedule.arrivalStation?.name || schedule.arrivalStation?.code}</div>
                    </div>
                </div>

                <div className="krl-info-section">
                    <div className="krl-train-name">
                        <span className="badge badge-primary">{train.trainType}</span>
                        <span>{train.name}</span>
                    </div>

                    <div className="krl-meta">
                        <span className="krl-countdown">{getTimeUntilDeparture(schedule.departureTime)}</span>
                        <button
                            className="btn-route-map"
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewRoute?.({ schedule, train });
                            }}
                        >
                            🗺️ Lihat Rute
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
