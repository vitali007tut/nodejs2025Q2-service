# Home Library Service

REST API for managing a home music library. Allows you to manage users, artists, albums, tracks, and favorites.

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads)
- Node.js (>=22.14.0) - [Download & Install Node.js](https://nodejs.org/en/download/)
- Docker - [Download & Install Docker](https://www.docker.com/get-started)

## Quick Start

Follow these steps to get the application up and running:

### 1. Clone repository

```bash
git clone {repository URL}
cd nodejs2025Q2-service
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
cp .env.example .env
```

Edit `.env` file if needed. Default values should work for local development:

```env
PORT=4000
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=home_library
```

### 4. Start Docker containers

```bash
# Start PostgreSQL and application in Docker
docker-compose up -d postgres app-dev

# Check that containers are running
docker-compose ps

# View application logs (wait for "Application is running")
docker-compose logs -f app-dev
```

Wait for the application to start (you should see "Application is running on: http://localhost:4000" in logs).

### 5. Run tests

**Important:** The application must be running before running tests!

```bash
# Run all tests
npm run test

# Tests will automatically connect to localhost:${PORT} from .env file
```

### 6. Verify everything works

```bash
# 1. Check server response
curl http://localhost:4000/user
# Expected: [] or array of users

# 2. Open Swagger documentation in browser
# http://localhost:4000/doc

# 3. Verify database connection
docker exec home-library-postgres psql -U postgres -d home_library -c "\dt"
# Should show tables: users, artists, albums, tracks, favorite_*

# 4. All tests should pass
npm run test
```

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

# Start dev
docker-compose up app-dev

# Check
docker-compose ps

# Stop
docker-compose down
```

## Running locally (without Docker)

If you prefer to run the application locally instead of in Docker:

```bash
# 1. Start only PostgreSQL in Docker
docker-compose up -d postgres

# 2. Wait for PostgreSQL to be ready
docker-compose ps postgres
# Should show "healthy" status

# 3. Start application locally
# Windows (Git Bash)
POSTGRES_HOST=localhost npm run start:dev

# Windows (PowerShell)
$env:POSTGRES_HOST="localhost"; npm run start:dev

# Linux/Mac
POSTGRES_HOST=localhost npm run start:dev

# 4. Wait for "Application is running on: http://localhost:4000"
```

**Note:** When running locally, make sure `POSTGRES_HOST=localhost` is set, as the application needs to connect to PostgreSQL running in Docker.

## Testing

**Important:** The application must be running before running tests!

### Running Tests

Tests automatically read the `PORT` from `.env` file and connect to `localhost:${PORT}`.

#### Option A: Application running in Docker (recommended)

```bash
# 1. Start application in Docker
docker-compose up -d app-dev

# 2. Wait for application to start (check logs)
docker-compose logs -f app-dev
# Wait for: "Application is running on: http://localhost:4000"

# 3. Run tests in another terminal
npm run test
```

#### Option B: Application running locally

```bash
# 1. Start only PostgreSQL in Docker
docker-compose up -d postgres

# 2. Start application locally
# Windows (Git Bash)
POSTGRES_HOST=localhost npm run start:dev

# Windows (PowerShell)
$env:POSTGRES_HOST="localhost"; npm run start:dev

# Linux/Mac
POSTGRES_HOST=localhost npm run start:dev

# 3. Wait for "Application is running on: http://localhost:4000"

# 4. Run tests in another terminal
npm run test
```

### Test Commands

```bash
# Run all tests
npm run test

# Run specific test suite
npm run test -- test/users.e2e.spec.ts

# Run tests with authorization
npm run test:auth

# Run tests in watch mode
npm run test:watch
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

| Variable                  | Default      | Description                                      |
| ------------------------- | ------------ | ------------------------------------------------ |
| PORT                      | 4000         | Application port                                 |
| CRYPT_SALT                | 10           | Bcrypt salt rounds                               |
| JWT_SECRET_KEY            | -            | JWT access token secret                          |
| JWT_SECRET_REFRESH_KEY    | -            | JWT refresh token secret                         |
| TOKEN_EXPIRE_TIME         | 1h           | Access token expiration                          |
| TOKEN_REFRESH_EXPIRE_TIME | 24h          | Refresh token expiration                         |
| POSTGRES_HOST             | postgres     | PostgreSQL host (use `localhost` for local runs) |
| POSTGRES_USER             | postgres     | PostgreSQL username                              |
| POSTGRES_PASSWORD         | postgres     | PostgreSQL password                              |
| POSTGRES_DB               | home_library | PostgreSQL database name                         |
| POSTGRES_PORT             | 5432         | PostgreSQL port                                  |
| LOG_LEVEL                 | log           | Logging level (error, warn, log, debug, verbose) |

## Logging

The application uses a custom `LoggingService` for logging all requests, responses, and errors. Logs are written to `stdout` and can be viewed through Docker logs.

### Viewing Logs

#### Real-time logs (follow mode)

```bash
# View all application logs in real-time
docker-compose logs -f app-dev

# View only last 100 lines and follow
docker-compose logs --tail=100 -f app-dev
```

#### View recent logs

```bash
# Last 50 lines
docker-compose logs --tail=50 app-dev

# Last 100 lines
docker-compose logs --tail=100 app-dev

# All logs
docker-compose logs app-dev
```

### What Gets Logged

#### 1. Incoming Requests
Every incoming request is logged with:
- HTTP method (GET, POST, PUT, DELETE)
- URL path
- Query parameters (if present)
- Request body (if present, passwords are masked as `***`)

**Example log:**
```
[LoggingService] Incoming request: GET /user?page=1 | Query: {"page":"1"} | Body: {}
[LoggingService] Incoming request: POST /user | Body: {"login":"testuser","password":"***"}
```

#### 2. Responses
Every response is logged with:
- HTTP method and URL
- Status code
- Response time in milliseconds

**Example log:**
```
[LoggingService] GET /user - 200 - 15ms
[LoggingService] POST /user - 201 - 22ms
```

#### 3. Errors
All errors are logged with:
- HTTP method and URL
- Status code
- Error message
- Stack trace (for 500 errors)

**Example logs:**
```
[LoggingService] GET /user/invalid-uuid - 400 - userId is invalid (not uuid)
[LoggingService] GET /test-error - 500 - Test uncaught exception
```

### Testing Logging

#### Test request logging

```bash
# 1. Start application
docker-compose up -d app-dev

# 2. Make a request with query parameters
curl "http://localhost:4000/user?page=1&limit=10"

# 3. Check logs
docker-compose logs --tail=20 app-dev | grep "Incoming request"
# Expected: Incoming request: GET /user?page=1&limit=10 | Query: {"page":"1","limit":"10"}
```

#### Test request body logging

```bash
# 1. Make a POST request
curl -X POST http://localhost:4000/user \
  -H "Content-Type: application/json" \
  -d '{"login":"testuser","password":"secret123"}'

# 2. Check logs (password should be masked)
docker-compose logs --tail=20 app-dev | grep "Incoming request"
# Expected: Incoming request: POST /user | Body: {"login":"testuser","password":"***"}
```

#### Test error logging

```bash
# 1. Make a request that causes an error
curl http://localhost:4000/user/invalid-uuid

# 2. Check error logs
docker-compose logs --tail=20 app-dev | grep -E "(ERROR|WARN)"
# Expected: Error logs with status code and message
```

#### Test uncaught exception handler

```bash
# 1. Test uncaught exception endpoint (if available)
curl http://localhost:4000/test-error

# 2. Check logs for uncaught exception
docker-compose logs --tail=20 app-dev | grep -E "(Uncaught|500)"
```

### Log Levels

The logging level can be controlled via `LOG_LEVEL` environment variable:

| Level   | Value | Description                                    |
| ------- | ----- | ---------------------------------------------- |
| error   | 0     | Only errors                                    |
| warn    | 1     | Errors and warnings                            |
| log     | 2     | Errors, warnings, and info (default)          |
| debug   | 3     | All above + debug messages                     |
| verbose | 4     | All messages including verbose                |

**Set log level:**

```bash
# In .env file
LOG_LEVEL=debug

# Or when running locally
LOG_LEVEL=debug npm run start:dev
```

**Example with different log levels:**

```bash
# Set to 'warn' - only errors and warnings will be logged
LOG_LEVEL=warn docker-compose up -d app-dev

# Set to 'debug' - all logs including debug messages
LOG_LEVEL=debug docker-compose up -d app-dev
```

### Filtering Logs

#### Filter by log level

```bash
# Show only errors
docker-compose logs app-dev | grep ERROR

# Show only warnings
docker-compose logs app-dev | grep WARN

# Show all logs except debug
docker-compose logs app-dev | grep -v DEBUG
```

#### Filter by endpoint

```bash
# Show logs for /user endpoint
docker-compose logs app-dev | grep "/user"

# Show logs for POST requests
docker-compose logs app-dev | grep "POST"

# Show logs for errors on specific endpoint
docker-compose logs app-dev | grep "/user" | grep ERROR
```

#### Filter by time

```bash
# Show logs since specific time
docker-compose logs --since 10m app-dev

# Show logs from last hour
docker-compose logs --since 1h app-dev
```

### Log Format

Logs follow this format:
```
[Nest] <PID> - <Timestamp> <LEVEL> [Context] <Message>
```

**Example:**
```
[Nest] 62 - 12/10/2025, 12:40:14 PM LOG [LoggingService] Incoming request: GET /user?test=123 | Query: {"test":"123"}
[Nest] 62 - 12/10/2025, 12:40:14 PM LOG [LoggingService] GET /user?test=123 - 200 - 14ms
[Nest] 62 - 12/10/2025, 12:40:21 PM ERROR [LoggingService] POST /user - 500 - Internal server error
```

### Common Logging Commands

```bash
# Watch logs in real-time
docker-compose logs -f app-dev

# View last 50 lines
docker-compose logs --tail=50 app-dev

# View logs for specific time period
docker-compose logs --since 30m app-dev

# View logs and filter for errors
docker-compose logs app-dev | grep ERROR

# View logs and filter for specific endpoint
docker-compose logs app-dev | grep "/user"

# Save logs to file
docker-compose logs app-dev > app-logs.txt

# View logs from specific container
docker logs home-library-app-dev
```

## Verification & Troubleshooting

### Verify Application is Running

```bash
# Check container status
docker-compose ps

# Check server response
curl http://localhost:4000/user

# Check Swagger documentation
# Open in browser: http://localhost:4000/doc

# Verify database tables exist
docker exec home-library-postgres psql -U postgres -d home_library -c "\dt"
# Should show: users, artists, albums, tracks, favorite_artists, favorite_albums, favorite_tracks, migrations
```

### Common Issues

#### Port 4000 is already in use

```bash
# Find process using port 4000
# Windows
netstat -ano | findstr :4000

# Linux/Mac
lsof -i :4000

# Kill the process
# Windows
taskkill //PID <PID> //F

# Linux/Mac
kill -9 <PID>

# Or stop Docker containers
docker-compose down
```

#### Application won't start

```bash
# Check application logs
docker-compose logs app-dev

# Check PostgreSQL is running and healthy
docker-compose ps postgres

# Verify database connection from container
docker exec home-library-app-dev ping postgres
```

#### Tests are failing

```bash
# 1. Verify server is running
curl http://localhost:4000/user

# 2. Check PORT in .env file
cat .env | grep PORT

# 3. Ensure tests read the correct port
# test/lib/request.ts uses: process.env.PORT || 4000

# 4. Make sure application is fully started before running tests
docker-compose logs app-dev
# Wait for: "Application is running on: http://localhost:4000"
```

### Useful Commands

#### View logs

```bash
# Application logs
docker-compose logs -f app-dev

# PostgreSQL logs
docker-compose logs -f postgres

# Last 50 lines
docker-compose logs --tail=50 app-dev
```

#### Restart services

```bash
# Restart only application
docker-compose restart app-dev

# Restart all services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build app-dev
```

#### Clean up

```bash
# Stop and remove containers
docker-compose down

# Stop, remove containers and volumes (⚠️ deletes database data!)
docker-compose down -v

# Stop, remove containers, volumes and images
docker-compose down -v --rmi all
```

## Docker Architecture

- `postgres` - PostgreSQL 16 database
- `app` - Production application (multi-stage build)
- `app-dev` - Development application with hot reload

### Volumes

- `postgres_data` - Database files
- `postgres_logs` - Database logs

### Network

- `home-library-network` - Bridge network for container communication
