# Video Streaming Backend - Project Structure

This document outlines the project structure following Clean Architecture and Domain-Driven Design (DDD) principles using NestJS framework.

## Architecture Overview

The project follows a modular monolithic architecture with clear separation of concerns through layers:

- **Domain Layer**: Business logic and entities
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: External concerns (database, file storage, etc.)
- **Presentation Layer**: Controllers and DTOs

## Root Structure

```
backend/
-- src/                    # Source code
-- docs/                   # Documentation
-- docker/                 # Docker configuration
-- dist/                   # Compiled output
-- package.json            # Dependencies and scripts
-- tsconfig.json          # TypeScript configuration
-- nest-cli.json          # NestJS CLI configuration
-- eslint.config.mjs      # ESLint configuration
-- .prettierrc            # Prettier configuration
-- docker-compose.yml     # Docker services orchestration
------Dockerfile             # Container definition
```

## Source Code Structure (`src/`)

### Core Application Files

```
src/
-- main.ts               # Application entry point
-- app.module.ts         # Root application module
-- app.controller.ts     # Root controller (health check)
------worker.ts            # Background worker processes
```

### Modules (`src/modules/`)

Each module follows the same layered architecture pattern:

#### Authentication Module (`auth/`)

Not yet implemented

```
auth/
```

#### Video Module (`video/`)

The main business domain with complete layered architecture:

```
video/
------video.module.ts
------application/         # Application layer
----------commands/        # Command objects
----------dto/            # Data Transfer Objects
----------handlers/       # Command/Event handlers
----------queries/        # Query objects
----------services/       # Application services
----------types/          # Application types
----------use-cases/      # Business use cases
------domain/             # Domain layer
----------entities/       # Domain entities
----------events/         # Domain events
----------repositories/   # Repository interfaces
----------value-objects/  # Value objects
------infrastructure/     # Infrastructure layer
----------repositories/   # Repository implementations
----------workers/        # Background workers
------presentation/       # Presentation layer
----------controllers/    # HTTP controllers
----------dto/           # Presentation DTOs
```

#### Search Module (`search/`)

Implements search functionality with strategy pattern:

```
search/
------search.module.ts
------application/
----------dto/
----------factories/      # Strategy factory
----------queries/
----------services/
----------strategies/     # Search strategy implementations
----------use-cases/
------presentation/
------controllers/
```

#### User Module (`user/`)

User management with simplified structure:

```
user/
------user.module.ts
------user.controller.ts
------user.service.ts
------domain/
----------- entities/
----------- repositories/
    ------value-objects/
```

#### Common Module (`common/`)

Shared domain objects:

```
common/
------base.entity.ts      # Base entity class
------base.vo.ts         # Base value object
------email.vo.ts        # Email value object
```

### Shared Layer (`src/shared/`)

Contains cross-cutting concerns and shared utilities:

#### Configuration (`config/`)

```
config/
------app.config.ts         # Application configuration
------aws.config.ts         # AWS services configuration
------database.config.ts    # Database configuration
------elasticsearch.config.ts # Search engine configuration
------queue.config.ts       # Message queue configuration
------redis.config.ts       # Redis cache configuration
```

#### Core Framework Components (`core/`)

```
core/
------decorators/          # Custom decorators
------exceptions/          # Custom exception classes
------filters/            # Exception filters
------guards/             # Authentication/authorization guards
------interceptors/       # Request/response interceptors
------pipes/              # Validation and transformation pipes
------types/              # Shared type definitions
```

#### Infrastructure Services (`infrastructure/`)

```
infrastructure/
------aws/               # AWS services (S3, etc.)
------cache/             # Caching services (Redis)
------database/          # Database services and migrations
----------prisma/        # Prisma ORM configuration
------elasticsearch/     # Search engine services
------monitoring/        # Health checks and metrics
------queue/             # Message queue services
------workers/           # Background job processors
```

#### Utilities (`utils/`, `interfaces/`)

```
interfaces/            # Shared interfaces
------cache.service.interface.ts

utils/                 # Utility functions
------string.util.ts
------validation.util.ts
```

## Key Design Patterns

### 1. Clean Architecture Layers

- **Domain**: Pure business logic, no external dependencies
- **Application**: Orchestrates domain objects, contains use cases
- **Infrastructure**: Implements external concerns (database, APIs)
- **Presentation**: HTTP controllers and request/response handling

### 2. Domain-Driven Design

- **Entities**: Core business objects with identity
- **Value Objects**: Immutable objects representing domain concepts
- **Repositories**: Abstractions for data persistence
- **Domain Events**: Capture domain state changes

### 3. CQRS (Command Query Responsibility Segregation)

- **Commands**: Operations that change state
- **Queries**: Operations that read data
- **Handlers**: Process commands and queries separately

### 4. Strategy Pattern

- **Search Strategies**: Multiple search implementations (Elasticsearch, Repository)
- **Factory Pattern**: Creates appropriate strategy instances

## File Naming Conventions

- **Entities**: `*.entity.ts`
- **Value Objects**: `*.vo.ts`
- **DTOs**: `*.dto.ts`
- **Controllers**: `*.controller.ts`
- **Services**: `*.service.ts`
- **Use Cases**: `*.use-case.ts`
- **Repositories**: `*.repository.ts` (interfaces), `*-prisma.repository.ts` (implementations)
- **Configurations**: `*.config.ts`
- **Workers**: `*.worker.ts`

## Database Layer

### Prisma ORM

```
database/prisma/
------schema.prisma        # Database schema definition
------prisma.service.ts    # Prisma client service
------seed.ts             # Database seeding
------migrations/         # Database migrations
```

## Infrastructure Services

### External Services Integration

- **AWS S3**: File storage for video uploads
- **Elasticsearch**: Video search indexing
- **Redis**: Caching and session storage
- **RabbitMQ**: Message queue for background processing
- **PostgreSQL**: Primary database

### Monitoring and Health Checks

- Health check endpoints for service monitoring
- Request/response logging
- Error tracking and filtering

This structure ensures maintainability, testability, and scalability while following industry best practices for enterprise-grade applications.
