exports.formatScheduleTime = (dateTime) => {
  const d = new Date(dateTime);
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

exports.formatFullDate = (dateTime) => {
  const d = new Date(dateTime);
  return d.toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Hitung durasi perjalanan
exports.getDuration = (start, end) => {
  const diff = Math.abs(new Date(end) - new Date(start));
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours}j ${minutes}m`;
};
