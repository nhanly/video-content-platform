# Development Guideline for Video Streaming Platform

## Table of Contents

- [Quick Start for New Developers](#quick-start-for-new-developers)
- [Development Environment Setup](#development-environment-setup)
- [Understanding the Codebase](#understanding-the-codebase)
- [Step-by-Step Feature Implementation](#step-by-step-feature-implementation)
- [Code Standards and Best Practices](#code-standards-and-best-practices)
- [Testing Guidelines](#testing-guidelines)
- [Deployment and CI/CD](#deployment-and-cicd)

## Quick Start for New Developers

### Prerequisites

- Node.js 18+ and pnpm
- Docker and Docker Compose
- PostgreSQL knowledge
- TypeScript/NestJS experience
- Understanding of Clean Architecture principles

### First Steps

1. **Clone and Setup**

   ```bash
   git clone <repository-url>
   cd backend
   pnpm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

3. **Start Infrastructure Services**

   ```bash
   docker-compose up -d postgres redis rabbitmq elasticsearch
   ```

4. **Database Setup**

   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate
   ```

5. **Start Development Server**

   ```bash
   pnpm start:dev
   ```

6. **Verify Setup**
   - API: http://localhost:3000
   - Health Check: http://localhost:3000/health
   - API Docs: http://localhost:3000/api

### Essential Reading

Before implementing features, read these documents:

- [project-structure.md](./project-structure.md) - Understanding the codebase organization
- [system-design.md](./system-design.md) - Architecture decisions and patterns
- [start-up-guideline.md](./start-up-guideline.md) - Docker setup and services

## Architecture Overview

### Clean Architecture Layers

Our codebase follows Clean Architecture with these layers:

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │  ← Controllers, DTOs, Guards
├─────────────────────────────────────────┤
│           Application Layer             │  ← Use Cases, Services, Handlers
├─────────────────────────────────────────┤
│             Domain Layer                │  ← Entities, Value Objects, Events
├─────────────────────────────────────────┤
│          Infrastructure Layer           │  ← Database, External APIs, Queue
└─────────────────────────────────────────┘
```

### Key Principles

1. **Dependency Rule**: Inner layers should not depend on outer layers
2. **Domain First**: Business logic lives in domain entities
3. **Interface Segregation**: Use interfaces for external dependencies
4. **CQRS**: Separate command and query operations

## Development Environment Setup

### IDE Recommendations

**VSCode Extensions:**

- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Prisma

### Docker Development Workflow

**Option 1: Hybrid (Recommended)**

```bash
# Start only infrastructure services
docker-compose up -d postgres redis rabbitmq elasticsearch

# Run application locally for faster development
pnpm start:dev
```

**Option 2: Full Docker**

```bash
# Start everything including backend
docker-compose up -d
```

### Key Patterns in Use

1. **Repository Pattern**: Abstract data access
2. **Strategy Pattern**: Multiple implementations (e.g., search strategies)
3. **CQRS**: Command Query Responsibility Segregation
4. **Domain Events**: Decouple business logic
5. **Factory Pattern**: Create complex objects

## Step-by-Step Feature Implementation

### Design the Domain

Start with the domain layer (inside-out approach):

- Create entity
- Create Value Objects
- Define Repository Interface

### Implement Application Layer

- Create Use Cases
- Define DTOs

### Implement Infrastructure

- Implement Repository
- Update Prisma Schema

### Create Presentation Layer

- Implement Controller
- Add API Documentation

### Wire Everything Together

- Create specific module
- Add to App module

### Testing

- Unit Tests
- Integration Tests
