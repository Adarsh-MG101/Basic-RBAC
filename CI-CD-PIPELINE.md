# GitLab CI/CD Pipeline Documentation

This document explains the GitLab CI/CD pipeline configuration for the Basic RBAC project.

## 📋 Overview

The pipeline is designed to automatically test, build, and deploy both the **backend** (Node.js/Express) and **frontend** (Next.js) applications. It consists of 5 main stages:

1. **Install** - Install dependencies
2. **Lint** - Code quality checks
3. **Test** - Run automated tests
4. **Build** - Build the applications
5. **Deploy** - Deploy to staging/production

## 🏗️ Pipeline Stages

### 1. Install Stage

**Jobs:**
- `install:backend` - Installs backend dependencies using `npm ci`
- `install:frontend` - Installs frontend dependencies using `npm install --legacy-peer-deps` (for React 19 compatibility)

**Features:**
- Only runs when files in respective directories change
- Caches `node_modules` for faster subsequent builds
- Artifacts are passed to subsequent stages
- Frontend uses `--legacy-peer-deps` to handle React 19 peer dependency conflicts

### 2. Lint Stage

**Jobs:**
- `lint:backend` - Runs ESLint on backend code
- `lint:frontend` - Runs ESLint on frontend code using Next.js config

**Purpose:**
- Ensures code quality and consistency
- Catches common errors before testing

### 3. Test Stage

**Jobs:**
- `test:backend` - Runs Jest tests with MongoDB Memory Server
- `test:frontend` - Runs Jest tests with React Testing Library

**Features:**
- Backend tests use a MongoDB service for integration testing
- Coverage reports are generated automatically
- Environment variables are set for testing

**Environment Variables (Backend Tests):**
```yaml
MONGO_URI: "mongodb://mongo:27017/test_db"
JWT_SECRET: "test_jwt_secret_key_for_ci"
ADMIN_EMAIL: "admin@test.com"
ADMIN_PASSWORD: "testpassword123"
```

### 4. Build Stage

**Jobs:**
- `build:backend` - Verifies backend structure
- `build:frontend` - Builds Next.js production bundle

**Artifacts:**
- Backend: All files except `node_modules`
- Frontend: `.next/` and `public/` directories
- Artifacts expire after 1 week

### 5. Deploy Stage

**Jobs:**
- `deploy:staging` - Deploys to staging environment (manual trigger)
- `deploy:production` - Deploys to production environment (manual trigger)

**Branch Rules:**
- Staging: Deploys from `develop` branch
- Production: Deploys from `main` or `master` branch

## 🚀 Getting Started

### Prerequisites

1. **GitLab Repository** with CI/CD enabled
2. **GitLab Runner** configured (or use shared runners)
3. **Environment Variables** set in GitLab CI/CD settings

### Required GitLab CI/CD Variables

Navigate to **Settings > CI/CD > Variables** and add:

#### Backend Variables (Production)
```
MONGO_URI - MongoDB connection string
JWT_SECRET - Secret key for JWT tokens
ADMIN_EMAIL - Default admin email
ADMIN_PASSWORD - Default admin password
PORT - Server port (default: 5000)
```

#### Frontend Variables (Production)
```
NEXT_PUBLIC_API_URL - Backend API URL
```

### Optional: Docker Registry Variables
```
CI_REGISTRY_IMAGE - Docker registry image path
CI_REGISTRY_USER - Docker registry username
CI_REGISTRY_PASSWORD - Docker registry password
```

## 📦 Caching Strategy

The pipeline uses GitLab's cache mechanism to speed up builds:

```yaml
cache:
  key:
    files:
      - backend/package-lock.json
      - frontend/package-lock.json
  paths:
    - backend/node_modules/
    - frontend/node_modules/
    - frontend/.next/cache/
```

**Benefits:**
- Faster dependency installation
- Reduced build times
- Efficient use of runner resources

## 🧪 Running Tests Locally

### Backend Tests
```bash
cd backend
npm install
npm test
```

### Frontend Tests
```bash
cd frontend
npm install
npm test
```

## 🔧 Customization

### Adding More Test Coverage

1. **Backend**: Add test files in `backend/__tests__/` directory
2. **Frontend**: Add test files in `frontend/__tests__/` directory

### Modifying Deployment

Edit the `deploy:staging` and `deploy:production` jobs in `.gitlab-ci.yml`:

```yaml
deploy:production:
  script:
    - echo "Add your deployment commands here"
    # Example: SSH deployment
    - scp -r backend/ user@server:/path/
    - ssh user@server "pm2 restart backend"
```

### Docker Deployment (Optional)

Uncomment the Docker build jobs at the bottom of `.gitlab-ci.yml` to enable Docker image building:

```yaml
build:docker:backend:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHORT_SHA .
    - docker push $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHORT_SHA
```

## 📊 Pipeline Visualization

```
┌─────────────┐
│   Install   │
│  Backend &  │
│  Frontend   │
└──────┬──────┘
       │
┌──────▼──────┐
│    Lint     │
│  Backend &  │
│  Frontend   │
└──────┬──────┘
       │
┌──────▼──────┐
│    Test     │
│  Backend &  │
│  Frontend   │
└──────┬──────┘
       │
┌──────▼──────┐
│    Build    │
│  Backend &  │
│  Frontend   │
└──────┬──────┘
       │
┌──────▼──────┐
│   Deploy    │
│  Staging or │
│ Production  │
└─────────────┘
```

## 🔍 Troubleshooting

### Pipeline Fails at Install Stage
- Check `package.json` and `package-lock.json` are committed
- Verify Node version compatibility (currently using Node 20)

### Tests Fail
- Ensure all environment variables are set
- Check MongoDB service is running for backend tests
- Review test logs in GitLab CI/CD pipeline view

### Build Fails
- Frontend: Check for TypeScript errors
- Backend: Verify all required files exist
- Review build logs for specific errors

### Deployment Issues
- Verify SSH keys are configured in GitLab CI/CD variables
- Check server accessibility
- Ensure deployment scripts have proper permissions

## 📝 Best Practices

1. **Always run tests locally** before pushing
2. **Use feature branches** and merge to `develop` first
3. **Manual deployment approval** prevents accidental production deployments
4. **Monitor pipeline execution** in GitLab's CI/CD view
5. **Keep dependencies updated** regularly
6. **Review coverage reports** to maintain test quality

## 🔗 Useful Links

- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [Jest Documentation](https://jestjs.io/)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [Supertest Documentation](https://github.com/visionmedia/supertest)

## 📞 Support

For issues or questions about the CI/CD pipeline:
1. Check the GitLab pipeline logs
2. Review this documentation
3. Contact the DevOps team

---

**Last Updated:** February 2026
**Pipeline Version:** 1.0.0
