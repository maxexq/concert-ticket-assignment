# Free Concert Tickets Reservation System Assignment

A full-stack monorepo application for managing free concert tickets reservations. Built with NestJS (API) and Next.js (Web) using Turborepo for monorepo management.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Configuration](#setup--configuration)
- [Running the Application](#running-the-application)
- [Running Unit Tests](#running-unit-tests)
- [API Endpoints](#api-endpoints)
- [Libraries & Packages](#libraries--packages)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js Frontend (Web)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   React     │  │ React Query │  │     Role Context        │  │
│  │ Components  │  │  (Caching)  │  │  (Admin/User Switch)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                          │                                       │
│                    Axios Instance                                │
│                   (x-role header)                                │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NestJS Backend (API)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Controllers │  │   Guards    │  │       Services          │  │
│  │             │◄─┤ (RolesGuard)│◄─┤  (Business Logic)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                                              │                   │
│                          ┌───────────────────┼───────────────┐   │
│                          ▼                   ▼               │   │
│                   ┌─────────────┐     ┌─────────────┐        │   │
│                   │    Redis    │     │  PostgreSQL │        │   │
│                   │   (Cache)   │     │    (Data)   │        │   │
│                   └─────────────┘     └─────────────┘        │   │
└─────────────────────────────────────────────────────────────────┘
```

<img width="404" height="1133" alt="image" src="https://github.com/user-attachments/assets/9fac4aab-8109-4cee-a097-154bf2a0e603" />


### Design Patterns

- **Monorepo Architecture**: Uses Turborepo for managing multiple apps
- **Role-Based Access Control**: Header-based role switching (admin/user) with guard protection
- **Repository Pattern**: TypeORM repositories for database operations
- **Caching Strategy**: Redis caching with TTL for frequently accessed data
- **Pessimistic Locking**: Prevents race conditions during concurrent reservations
- **React Query**: Client-side caching and state management for API data

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Backend | NestJS 11, TypeScript |
| Database | PostgreSQL 16 |
| Cache | Redis |
| Monorepo | Turborepo |
| Styling | Tailwind CSS, MUI |

## Project Structure

```
concert-ticket-mono/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── common/         # Guards, decorators, services
│   │   │   ├── concerts/       # Concert module (CRUD)
│   │   │   └── reservations/   # Reservation module
│   │   ├── docker-compose.yml  # PostgreSQL & Redis
│   │   └── package.json
│   │
│   └── web/                    # Next.js Frontend
│       ├── app/                # App router pages
│       ├── components/         # React components
│       ├── contexts/           # React contexts (Role)
│       ├── hooks/              # React Query hooks
│       ├── lib/                # API services, utilities
│       └── package.json
│
├── package.json                # Root package.json
└── turbo.json                  # Turborepo configuration
```

## Setup & Configuration

### Prerequisites

- Node.js >= 18
- npm >= 9
- Docker & Docker Compose (for PostgreSQL and Redis)

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd concert-ticket-mono
npm install
```

### 2. Start Database Services

Navigate to the API directory and start PostgreSQL and Redis:

```bash
cd apps/api
docker-compose up -d
```

This will start:
- PostgreSQL on port `5432`
- Redis on port `6379`

### 3. Configure Environment Variables

Create a `.env` file in `apps/api/`:

```bash
cp apps/api/.env.example apps/api/.env
```

Update the values in `.env`:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=free_concert_tickets

REDIS_HOST=localhost
REDIS_PORT=6379

CORS_ORIGIN=http://localhost:5172
```

### 4. (Optional) Configure Frontend Environment

Create a `.env.local` file in `apps/web/` if you need to customize the API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5172
```

## Running the Application

### Development Mode

From the root directory:

```bash
# Run both API and Web concurrently
npm run dev

# Run API only (port 3000)
npm run dev:api

# Run Web only (port 5172)
npm run dev:web
```

## Running Unit Tests

### Run All Tests

```bash
npm run test
```

### API Tests

```bash
# Run all API tests
npm run test:api

# Run tests in watch mode
npm run test:api:watch

# Run tests with coverage report
npm run test:api:cov
```

### Test Structure

The API tests are located in `apps/api/src/` alongside their respective modules:

```
apps/api/src/
├── concerts/
│   ├── concerts.service.spec.ts      # 12 tests
│   └── concerts.controller.spec.ts   # 5 tests
└── reservations/
    ├── reservations.service.spec.ts  # 13 tests
    └── reservations.controller.spec.ts # 6 tests
```

**Total: 36 unit tests**

### Test Coverage

Tests cover:
- Concert CRUD operations
- Reservation creation with pessimistic locking
- Reservation cancellation
- Cache hit/miss scenarios
- Error handling (NotFoundException, ConflictException, BadRequestException)
- Role-based access control

## API Endpoints

### Concerts

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/concerts` | Admin | Get all concerts |
| GET | `/concerts/with-status` | User | Get concerts with reservation status |
| GET | `/concerts/:id` | All | Get concert by ID |
| POST | `/concerts` | Admin | Create a new concert |
| DELETE | `/concerts/:id` | Admin | Delete a concert |

### Reservations

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/reservations` | Admin | Get all reservations |
| GET | `/reservations/stats` | Admin | Get reservation statistics |
| GET | `/reservations/history` | Admin | Get all reservation history |
| GET | `/reservations/my-history` | User | Get user's reservation history |
| POST | `/reservations` | User | Create a reservation |
| DELETE | `/reservations/:id` | User | Cancel a reservation |

## Libraries & Packages

### Backend (API)

| Package | Version | Role |
|---------|---------|------|
| `@nestjs/core` | ^11.0.1 | Core NestJS framework |
| `@nestjs/config` | ^4.0.3 | Environment configuration |
| `@nestjs/typeorm` | ^11.0.0 | TypeORM integration for database |
| `typeorm` | ^0.3.28 | ORM for PostgreSQL |
| `pg` | ^8.18.0 | PostgreSQL driver |
| `ioredis` | ^5.9.3 | Redis client |
| `@nestjs-modules/ioredis` | ^2.0.2 | NestJS Redis module |
| `class-validator` | ^0.14.3 | DTO validation |
| `class-transformer` | ^0.5.1 | Object transformation |
| `jest` | ^30.0.0 | Testing framework |

### Frontend (Web)

| Package | Version | Role |
|---------|---------|------|
| `next` | 16.1.5 | React framework with App Router |
| `react` | ^19.2.0 | UI library |
| `@tanstack/react-query` | ^5.90.21 | Server state management & caching |
| `@tanstack/react-table` | ^8.21.3 | Table component for history |
| `axios` | ^1.13.5 | HTTP client |
| `@mui/material` | ^7.3.8 | Material UI components |
| `@emotion/react` | ^11.14.0 | CSS-in-JS for MUI |
| `tailwindcss` | ^4.1.18 | Utility-first CSS |
| `react-hook-form` | ^7.71.1 | Form handling |
| `react-toastify` | ^11.0.5 | Toast notifications |
| `lucide-react` | ^0.564.0 | Icons |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run all apps in development |
| `npm run dev:api` | Run API only |
| `npm run dev:web` | Run Web only |
| `npm run build` | Build all apps |
| `npm run test` | Run all tests |
| `npm run test:api` | Run API tests |
| `npm run test:api:cov` | Run API tests with coverage |
| `npm run lint` | Lint all apps |
| `npm run format` | Format code with Prettier |
| `npm run check-types` | Type check all apps |
