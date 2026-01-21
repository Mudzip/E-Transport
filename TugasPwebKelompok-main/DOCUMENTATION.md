# 🚆 E-Transport Application Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Features](#features)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Frontend Architecture](#frontend-architecture)
8. [Setup & Installation](#setup--installation)

---

## 1. Project Overview <a name="project-overview"></a>
**E-Transport** is a web-based train booking application designed to simulate the experience of booking tickets for Intercity (Antar Kota) and KRL (Commuter Line) trains. It allows users to search for schedules, view train details, and book tickets.

---

## 2. Technology Stack <a name="technology-stack"></a>

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: CSS Modules / Standard CSS with CSS Variables
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: Client-side state-based routing (Custom implementation)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: SQLite (Development) / PostgreSQL (Production ready)

---

## 3. Features <a name="features"></a>
- **Schedule Search**: user can search for train schedules by Origin, Destination, and Date.
- **Seat Selection**: Choose from distinct classes (Eksekutif, Bisnis, Ekonomi) where available.
- **Booking System**: Real-time booking creation with price calculation.
- **My Bookings**: View history of booked tickets.
- **Responsive Design**: Mobile-friendly interface.

---

## 4. Project Structure <a name="project-structure"></a>
```
E-Transport/
├── prisma/                 # Database schema and seeders
│   ├── schema.prisma       # Main database schema
│   └── seed.js             # Initial data seeder
├── src/                    # Backend Source Code
│   ├── controllers/        # Logic for handling requests
│   ├── routes/             # API Route definitions
│   ├── services/           # Business logic
│   └── app.js              # Business logic
├── frontend/               # Frontend Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main application views
│   │   └── App.jsx         # Main entry point
│   └── vite.config.js      # Vite configuration
└── package.json            # Project dependencies
```

---

## 5. Database Schema <a name="database-schema"></a>
The application uses a relational database with the following core models:

### `Station`
Represents train stations.
- `id`, `code`, `name`, `city`, `stationType`

### `Train`
Represents physical trains.
- `id`, `name`, `trainType` (Intercity/KRL)

### `Schedule`
Represents a specific journey.
- `id`, `departureTime`, `arrivalTime`
- Relations: `Train`, `OriginStation`, `DestinationStation`

### `Booking`
Represents a user's ticket.
- `id`, `userId`, `className`, `totalPrice`, `status`
- Relations: `Schedule`

---

## 6. API Documentation <a name="api-documentation"></a>
Base URL: `http://localhost:3000/api`

### Stations
- `GET /stations`: Get all stations
- `GET /stations/search`: Search stations

### Schedules
- `GET /schedules`: Search for schedules
  - Query Params: `originId`, `destinationId`, `date`

### Trains
- `GET /trains`: Get all trains
- `GET /trains/:id`: Get specific train details

### Bookings
- `POST /bookings`: Create a new booking
  - Body: `{ scheduleId, className, passengers }`
- `GET /bookings/my`: Get user's bookings

---

## 7. Frontend Architecture <a name="frontend-architecture"></a>
The frontend uses a single-page application (SPA) approach with manual view management.

### Key Pages
1.  **HomePage**: Search form for stations and dates.
2.  **ScheduleResultsPage**: Displays available train schedules matching the criteria.
3.  **MyBookingsPage**: Lists confirmed bookings for the user.

### Configuration
Environment variables in `.env`:
- `VITE_API_URL`: Points to the backend API (Default: `http://localhost:3000/api`)

---

## 8. Setup & Installation <a name="setup--installation"></a>

### Prerequisites
- Node.js (v18+)
- npm

### 1. Backend Setup
```bash
cd TugasPwebKelompok-main
npm install
# Setup Database (SQLite)
npx prisma db push
npm run seed
# Start Server
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Start Dev Server
npm run dev
```

Access the application at `http://localhost:5173`.
