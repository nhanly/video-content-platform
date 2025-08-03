import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('local', 'production', 'development', 'uat')
    .default('local'),
  PORT: Joi.number().port().default(3000),

  // Database configuration
  DATABASE_URL: Joi.string().required(),
  DB_HOST: Joi.string(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string(),
  DB_PASSWORD: Joi.string(),
  DB_NAME: Joi.string(),
  DB_MAX_CONNECTIONS: Joi.number().default(10),
  DB_CONNECTION_TIMEOUT: Joi.number().default(30000),

  // Redis configuration
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),
  REDIS_TTL: Joi.number().default(3600),
  REDIS_MAX_CONNECTIONS: Joi.number().default(10),
  REDIS_RETRY_ATTEMPTS: Joi.number().default(3),
  REDIS_CONNECTION_TIMEOUT: Joi.number().default(5000),
  REDIS_KEY_PREFIX: Joi.string().default('video_platform:'),

  // RabbitMQ configuration
  RABBITMQ_URL: Joi.string().default('amqp://localhost:5672'),
  RABBITMQ_VIDEO_PROCESSING_QUEUE: Joi.string().default(
    'video.processing.queue',
  ),
  RABBITMQ_DLX: Joi.string().default('video.dlx'),
  RABBITMQ_DLQ: Joi.string().default('video.dlq'),

  // Elasticsearch configuration
  ELASTICSEARCH_NODE: Joi.string().default('http://localhost:9200'),
  ELASTICSEARCH_INDEX: Joi.string().default('videos'),
  ELASTICSEARCH_USERNAME: Joi.string().allow('').optional(),
  ELASTICSEARCH_PASSWORD: Joi.string().allow('').optional(),

  // AWS configuration
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_S3_BUCKET_NAME: Joi.string().required(),
  AWS_S3_REGION: Joi.string().required(),
  AWS_MEDIA_CONVERT_ROLE: Joi.string().required(),
  AWS_MEDIA_CONVERT_ENDPOINT: Joi.string().required(),

  // Application configuration
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('15m'),
  REFRESH_TOKEN_EXPIRATION: Joi.string().default('7d'),
  ALLOWED_MIME_TYPES: Joi.string().default('video/mp4,video/webm'),
  MAX_VIDEO_SIZE: Joi.number().default(5 * 1024 * 1024 * 1024), // 5GB
  MAX_CONCURRENT_TRANSCODING: Joi.number().default(5),
  PROCESSING_MAX_ATTEMPTS: Joi.number().default(3),
  PROCESSING_BACKOFF_DELAY: Joi.number().default(30000),

  // Rate limiting
  RATE_LIMIT_WINDOW: Joi.number().default(15 * 60 * 1000), // 15 minutes
  RATE_LIMIT_MAX: Joi.number().default(100),
});
