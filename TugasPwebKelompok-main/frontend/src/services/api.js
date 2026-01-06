const API_BASE = 'http://localhost:3000/api';

export async function fetchStations(type = null) {
  const url = type ? `${API_BASE}/stations?type=${type}` : `${API_BASE}/stations`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch stations');
  return res.json();
}

export async function searchSchedules(originCode, destinationCode, options = {}) {
  // Backend expects: /schedules?origin=CODE&destination=CODE
  let url = `${API_BASE}/schedules?origin=${originCode}&destination=${destinationCode}`;
  if (options.classFilter) url += `&class=${options.classFilter}`;
  if (options.sort) url += `&sort=${options.sort}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch schedules');
  return res.json();
}

export async function fetchTrains(type = null) {
  const url = type ? `${API_BASE}/trains?type=${type}` : `${API_BASE}/trains`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch trains');
  return res.json();
}

export async function fetchTrainById(id) {
  const res = await fetch(`${API_BASE}/trains/${id}`);
  if (!res.ok) throw new Error('Failed to fetch train');
  return res.json();
}

export async function createBooking(data) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create booking');
  return res.json();
}

// Alias for backward compatibility
export const searchTrains = searchSchedules;
