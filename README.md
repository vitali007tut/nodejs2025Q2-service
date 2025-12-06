# Home Library Service

REST API для управления домашней музыкальной библиотекой. Позволяет управлять пользователями, артистами, альбомами, треками и избранным.

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads)
- Node.js (>=22.14.0) - [Download & Install Node.js](https://nodejs.org/en/download/)
- Docker - [Download & Install Docker](https://www.docker.com/get-started)

## Quick Start

### 1. Clone repository

```bash
git clone {repository URL}
cd nodejs2025Q2-service
```

### 2. Setup environment variables

```bash
cp .env.example .env
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run application

#### Option A: With Docker (recommended)

```bash
docker-compose up --build -d postgres app
```

#### Option B: Without Docker (local)

```bash
npm start
```

### 5. Verify application is running

```bash
curl http://localhost:4000/user
# Expected: []
```

Or open in browser: http://localhost:4000/doc

## API Endpoints

| Resource         | Endpoint           | Methods                |
| ---------------- | ------------------ | ---------------------- |
| Users            | `/user`            | GET, POST, PUT, DELETE |
| Artists          | `/artist`          | GET, POST, PUT, DELETE |
| Albums           | `/album`           | GET, POST, PUT, DELETE |
| Tracks           | `/track`           | GET, POST, PUT, DELETE |
| Favorites        | `/favs`            | GET                    |
| Favorite Artists | `/favs/artist/:id` | POST, DELETE           |
| Favorite Albums  | `/favs/album/:id`  | POST, DELETE           |
| Favorite Tracks  | `/favs/track/:id`  | POST, DELETE           |

## Running with Docker

### Production mode

```bash
# Start PostgreSQL and application
docker-compose up --build -d postgres app

# Check status
docker-compose ps

# View logs
docker-compose logs app

# Stop containers
docker-compose down
```

### Development mode (with hot reload)

```bash
# Start with hot reload (changes in src/ auto-restart app)
docker-compose up -d postgres app-dev

# Stop
docker-compose down
```

## Running locally (without Docker)

```bash
# Install dependencies
npm install

# Start application
npm start

# Or with hot reload
npm run start:dev
```

## Testing

**Important:** Application must be running before tests!

```bash
# Run all tests
npm run test

# Run specific test suite
npm run test -- test/users.e2e.spec.ts

# Run tests with authorization
npm run test:auth
```

## Development

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

### Build

```bash
npm run build
```

## Environment Variables

| Variable                  | Default      | Description              |
| ------------------------- | ------------ | ------------------------ |
| PORT                      | 4000         | Application port         |
| CRYPT_SALT                | 10           | Bcrypt salt rounds       |
| JWT_SECRET_KEY            | -            | JWT access token secret  |
| JWT_SECRET_REFRESH_KEY    | -            | JWT refresh token secret |
| TOKEN_EXPIRE_TIME         | 1h           | Access token expiration  |
| TOKEN_REFRESH_EXPIRE_TIME | 24h          | Refresh token expiration |
| POSTGRES_USER             | postgres     | PostgreSQL username      |
| POSTGRES_PASSWORD         | postgres     | PostgreSQL password      |
| POSTGRES_DB               | home_library | PostgreSQL database name |
| POSTGRES_PORT             | 5432         | PostgreSQL port          |

## Docker Architecture

- `postgres` - PostgreSQL 16 database
- `app` - Production application (multi-stage build)
- `app-dev` - Development application with hot reload

### Volumes

- `postgres_data` - Database files
- `postgres_logs` - Database logs

### Network

- `home-library-network` - Bridge network for container communication
