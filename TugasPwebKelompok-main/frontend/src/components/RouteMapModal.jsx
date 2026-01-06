// Mock KRL Route Data
const KRL_ROUTES = {
    'Bogor Line': [
        'Jakarta Kota', 'Jayakarta', 'Mangga Besar', 'Sawah Besar', 'Juanda',
        'Gondangdia', 'Cikini', 'Manggarai', 'Tebet', 'Cawang', 'Duren Kalibata',
        'Pasar Minggu', 'Pasar Minggu Baru', 'Tanjung Barat', 'Lenteng Agung',
        'Universitas Pancasila', 'Universitas Indonesia', 'Pondok Cina', 'Depok Baru',
        'Depok', 'Citayam', 'Bojong Gede', 'Cilebut', 'Bogor'
    ],
    'Bekasi Line': [
        'Jakarta Kota', 'Jayakarta', 'Mangga Besar', 'Sawah Besar', 'Juanda',
        'Gondangdia', 'Cikini', 'Manggarai', 'Jatinegara', 'Klender',
        'Buaran', 'Klender Baru', 'Cakung', 'Kranji', 'Bekasi'
    ],
    'Cikarang Line': [
        'Jakarta Kota', 'Jayakarta', 'Mangga Besar', 'Sawah Besar', 'Juanda',
        'Gondangdia', 'Cikini', 'Manggarai', 'Jatinegara', 'Klender',
        'Buaran', 'Klender Baru', 'Cakung', 'Kranji', 'Bekasi', 'Bekasi Timur',
        'Tambun', 'Cibitung', 'Metland Telaga Murni', 'Cikarang'
    ],
    'Tangerang Line': [
        'Duri', 'Grogol', 'Pesing', 'Taman Kota', 'Bojong Indah', 'Rawa Buaya',
        'Kalideres', 'Poris', 'Batu Ceper', 'Tangerang'
    ]
};

export default function RouteMapModal({ isOpen, onClose, schedule, train }) {
    if (!isOpen) return null;

    // Determine which line to show based on station names
    const getRouteLine = () => {
        const depStation = schedule?.departureStation?.name || '';
        const arrStation = schedule?.arrivalStation?.name || '';

        for (const [lineName, stations] of Object.entries(KRL_ROUTES)) {
            if (stations.some(s => depStation.includes(s) || s.includes(depStation)) ||
                stations.some(s => arrStation.includes(s) || s.includes(arrStation))) {
                return { name: lineName, stations };
            }
        }
        // Default to Bogor Line
        return { name: 'Bogor Line', stations: KRL_ROUTES['Bogor Line'] };
    };

    const routeLine = getRouteLine();
    const depName = schedule?.departureStation?.name || 'Asal';
    const arrName = schedule?.arrivalStation?.name || 'Tujuan';

    // Find indices for highlighting
    const depIndex = routeLine.stations.findIndex(s =>
        s.toLowerCase().includes(depName.toLowerCase()) ||
        depName.toLowerCase().includes(s.toLowerCase())
    );
    const arrIndex = routeLine.stations.findIndex(s =>
        s.toLowerCase().includes(arrName.toLowerCase()) ||
        arrName.toLowerCase().includes(s.toLowerCase())
    );

    const startIdx = Math.max(0, Math.min(depIndex, arrIndex) - 2);
    const endIdx = Math.min(routeLine.stations.length, Math.max(depIndex, arrIndex) + 3);
    const visibleStations = routeLine.stations.slice(startIdx, endIdx);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="route-map-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h3>🗺️ Peta Rute</h3>
                        <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>{routeLine.name}</p>
                    </div>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="route-map-container">
                        <div className="route-line-visual">
                            {visibleStations.map((station, idx) => {
                                const actualIdx = startIdx + idx;
                                const isDeparture = actualIdx === depIndex;
                                const isArrival = actualIdx === arrIndex;
                                const isInRoute = actualIdx >= Math.min(depIndex, arrIndex) &&
                                    actualIdx <= Math.max(depIndex, arrIndex);

                                return (
                                    <div
                                        key={station}
                                        className={`route-station ${isDeparture ? 'departure' : ''} ${isArrival ? 'arrival' : ''} ${isInRoute ? 'in-route' : ''}`}
                                    >
                                        <div className="station-marker">
                                            {isDeparture && <span className="marker-label">🚩</span>}
                                            {isArrival && <span className="marker-label">🏁</span>}
                                        </div>
                                        <div className="station-name">{station}</div>
                                        {idx < visibleStations.length - 1 && (
                                            <div className={`station-connector ${isInRoute && actualIdx < Math.max(depIndex, arrIndex) ? 'active' : ''}`}></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="route-summary">
                        <div className="summary-item">
                            <span className="summary-label">Dari</span>
                            <span className="summary-value">{depName}</span>
                        </div>
                        <div className="summary-arrow">→</div>
                        <div className="summary-item">
                            <span className="summary-label">Ke</span>
                            <span className="summary-value">{arrName}</span>
                        </div>
                    </div>

                    <div className="route-info-box">
                        <div className="info-row">
                            <span>🚇 Kereta</span>
                            <span>{train?.name || 'KRL Commuter'}</span>
                        </div>
                        <div className="info-row">
                            <span>📍 Pemberhentian</span>
                            <span>{Math.abs(arrIndex - depIndex)} stasiun</span>
                        </div>
                        <div className="info-row">
                            <span>⏱️ Estimasi</span>
                            <span>~{Math.abs(arrIndex - depIndex) * 3} menit</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
