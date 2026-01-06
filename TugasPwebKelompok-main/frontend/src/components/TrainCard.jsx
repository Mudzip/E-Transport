export default function TrainCard({ schedule, train, onSelect }) {
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
        return `${hours}h ${minutes}m`;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const lowestPrice = train.classes?.reduce((min, c) => c.price < min ? c.price : min, Infinity) || 0;

    return (
        <div className="train-card" onClick={() => onSelect({ schedule, train })}>
            <div className="train-info">
                <div className="train-name">{train.name}</div>
                <span className={`badge ${train.trainType === 'KRL' ? 'badge-primary' : 'badge-accent'}`}>
                    {train.trainType}
                </span>

                <div className="train-schedule">
                    <div className="time-block">
                        <div className="time">{formatTime(schedule.departureTime)}</div>
                        <div className="station-code">{schedule.departureStation?.code}</div>
                    </div>

                    <div className="duration">
                        <div className="duration-text">
                            {calculateDuration(schedule.departureTime, schedule.arrivalTime)}
                        </div>
                        <div className="duration-line"></div>
                        <div className="duration-text">Direct</div>
                    </div>

                    <div className="time-block">
                        <div className="time">{formatTime(schedule.arrivalTime)}</div>
                        <div className="station-code">{schedule.arrivalStation?.code}</div>
                    </div>
                </div>
            </div>

            <div className="train-price">
                <div className="price-label">Starting from</div>
                <div className="price-value">{formatPrice(lowestPrice)}</div>
            </div>
        </div>
    );
}
