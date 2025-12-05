# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://www.docker.com/get-started)
- Docker Hub account (for pushing images)

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application with Docker

### Development mode (with hot reload)

1. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file if needed.

2. Start containers:

   ```bash
   docker-compose up app-dev
   ```

   Application will restart automatically when you change files in `src/` folder.

### Production mode

1. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file if needed.

2. Build and start containers:
   ```bash
   docker-compose up --build app
   ```

### Building and pushing images

1. Build images:

   ```bash
   docker-compose build
   ```

2. Scan for vulnerabilities:

   ```bash
   npm run docker:scan
   ```

3. Tag and push to Docker Hub:
   ```bash
   docker tag home-library-app <your-dockerhub-username>/home-library-app:latest
   docker push <your-dockerhub-username>/home-library-app:latest
   ```

## Running application locally (without Docker)

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
