# Docker Setup for Video Streaming Backend

This directory contains Docker configuration for running the video streaming backend with all required services.

## Services Included

- **PostgreSQL**: Primary database with extensions for better performance
- **Redis**: Caching layer and session storage
- **RabbitMQ**: Message queue for video processing jobs
- **Elasticsearch**: Search engine for videos and content
- **Backend API**: NestJS application server
- **Worker**: Video processing worker service

## Quick Start

1. **Start all services:**

   ```bash
   docker-compose up -d
   ```

2. **View logs:**

   ```bash
   # All services
   docker-compose logs -f

   # Specific service
   docker-compose logs -f backend
   ```

3. **Stop all services:**

   ```bash
   docker-compose down
   ```

4. **Reset everything (including data):**
   ```bash
   docker-compose down -vcc
   docker-compose up -d
   ```

## Service URLs

- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **RabbitMQ Management**: http://localhost:15672 (admin/password)
- **Elasticsearch**: http://localhost:9200

## Environment Configuration

The services use environment variables defined in the docker-compose.yml file. For customization, you can:

1. Copy `.env.example` to `.env` and modify values
2. Override environment variables in docker-compose.yml

## Database Setup

The PostgreSQL database is automatically initialized with:

- Required extensions (uuid-ossp, pg_trgm, btree_gin)
- Proper timezone settings
- Performance optimizations

Run Prisma migrations after first startup:

```bash
docker-compose exec backend npx prisma migrate deploy
```

## Data Persistence

All data is persisted in Docker volumes:

- `postgres_data`: Database files
- `redis_data`: Redis persistence
- `rabbitmq_data`: RabbitMQ data
- `elasticsearch_data`: Search indexes
- `video_uploads`: Uploaded video files
- `video_processing`: Temporary processing files

## Development Workflow

1. **Start services:**

   ```bash
   docker-compose up -d postgres redis rabbitmq elasticsearch minio
   ```

2. **Run backend locally:**

   ```bash
   pnpm start:dev
   ```

3. **Or run everything in Docker:**
   ```bash
   docker-compose up -d
   ```

## Production Considerations

1. **Scaling:**
   - Use separate databases for different services
   - Scale worker services horizontally
   - Use load balancers
   - Consider managed services (AWS RDS, ElastiCache, etc.)

## Troubleshooting

### Service won't start

```bash
# Check service logs
docker-compose logs service-name

# Check if ports are already in use
netstat -tulpn | grep :5432
```

## Health Checks

All services include health checks that verify:

- Service is responding
- Dependencies are available
- Basic functionality works

Check health status:

```bash
docker-compose ps
```
