# Home Library Service

REST API for managing a home music library. Allows you to manage users, artists, albums, tracks, and favorites.

## Setup and Run with Docker

### 1. Clone repository and checkout branch

```bash
git clone https://github.com/vitali007tut/nodejs2025Q2-service.git
cd nodejs2025Q2-service
git checkout dev-part3
```

### 2. Install dependencies and setup environment

```bash
npm install
cp .env.example .env
```

### 3. Start services with Docker Compose

```bash
# Start PostgreSQL and application in Docker
docker-compose up -d postgres app-dev

# Check that containers are running
docker-compose ps

# View application logs (wait for "Application is running")
docker-compose logs -f app-dev
```

### 4. Run tests

**Important:** The application must be running before running tests!

**Note about Authentication:** This application implements JWT authentication. All endpoints except `/auth/signup`, `/auth/login`, `/doc`, and `/` require authentication.

```bash
# Run tests with authentication (RECOMMENDED)
npm run test:auth

# Run basic tests (will fail due to authentication requirements)
npm run test
```

**Test Modes:**

- `npm run test:auth` - Runs tests with proper authentication headers (all tests should pass)
- `npm run test` - Runs tests without authentication (will fail with 401 errors as expected)
- `npm run test:refresh` - Runs refresh token tests

### 5. Stop services

```bash
# Stop Docker containers
docker-compose down
```

## Additional Commands

### Stop all Node.js processes

```bash
# On Windows
taskkill /im node.exe /f

# On Linux/Mac
pkill -f node
```

### Stop process running on specific port

```bash
# Find process on port (example with port 4000)
# On Windows
netstat -ano | findstr :4000

# On Linux/Mac
lsof -i :4000

# Kill process by PID (after finding it with above commands)
# On Windows
taskkill //PID <PID> //F

# On Linux/Mac
kill -9 <PID>
```

## Authentication

The application uses JWT (JSON Web Token) authentication. To access protected endpoints, you need to:

1. **Sign up** a new user:

```bash
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"login":"testuser","password":"testpass123"}'
```

2. **Login** to get access token:

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"testuser","password":"testpass123"}'
```

Response will contain both tokens:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

3. **Use the access token** in subsequent requests:

```bash
curl -X GET http://localhost:4000/user \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## Refresh Token Testing

The application supports refresh tokens for obtaining new access tokens without re-authentication.

### Testing Refresh Token Functionality

1. **Create user and login** (if not done already):

```bash
# Create user
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"login":"refreshtest","password":"testpass123"}'

# Login and get tokens
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"refreshtest","password":"testpass123"}'
```

2. **Use refresh token to get new tokens** (Status: 200):

```bash
# Replace YOUR_REFRESH_TOKEN with the refreshToken from login response
curl -X POST http://localhost:4000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

Expected response:

```json
{
  "accessToken": "new_access_token...",
  "refreshToken": "new_refresh_token..."
}
```

3. **Test error scenarios**:

**Missing refreshToken (Status: 400):**

```bash
curl -X POST http://localhost:4000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Empty refreshToken (Status: 400):**

```bash
curl -X POST http://localhost:4000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":""}'
```

**Invalid refreshToken (Status: 403):**

```bash
curl -X POST http://localhost:4000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"invalid.token.here"}'
```

**Malformed refreshToken (Status: 403):**

```bash
curl -X POST http://localhost:4000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"completely-invalid-token"}'
```

### Public Endpoints (no authentication required):

- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Login and get tokens
- `POST /auth/refresh` - Refresh access token using refresh token
- `GET /` - Home page
- `GET /doc` - API documentation (Swagger)

### Protected Endpoints (authentication required):

- All `/user/*` endpoints
- All `/artist/*` endpoints
- All `/album/*` endpoints
- All `/track/*` endpoints
- All `/favs/*` endpoints

## Checking Logging Functionality

To verify that the logging functionality is working properly:

1. Make sure the application is running:

```bash
docker-compose up -d postgres app-dev
docker-compose logs -f app-dev
```

2. Make requests to the API to generate logs:

```bash
# Test public endpoints (no auth required)
curl http://localhost:4000/
curl http://localhost:4000/doc

# Test authentication
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"login":"testuser","password":"testpass123"}'

# Test protected endpoints (will return 401 without token)
curl http://localhost:4000/user
```

3. View the logs to confirm logging is working:

```bash
# View all application logs
docker-compose logs app-dev

# View logs in real-time
docker-compose logs -f app-dev

# Filter logs for specific endpoints
docker-compose logs app-dev | grep "/user"

# View only the most recent logs
docker-compose logs --tail=20 app-dev
```
