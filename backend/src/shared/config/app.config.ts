import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET,
      expiration: process.env.JWT_EXPIRATION || '15m',
      refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
    },
  },
  video: {
    maxSize: parseInt(process.env.MAX_VIDEO_SIZE, 10) || 5 * 1024 * 1024 * 1024, // 5GB
    allowedMimeTypes: process.env.ALLOWED_MIME_TYPES?.split(',') || [
      'video/mp4',
      'video/webm',
    ],
    processing: {
      maxAttempts: parseInt(process.env.PROCESSING_MAX_ATTEMPTS, 10) || 3,
      backoffDelay: parseInt(process.env.PROCESSING_BACKOFF_DELAY, 10) || 30000,
      concurrency: {
        upload: parseInt(process.env.UPLOAD_CONCURRENCY, 10) || 10,
        preview: parseInt(process.env.PREVIEW_CONCURRENCY, 10) || 3,
        metadata: parseInt(process.env.METADATA_CONCURRENCY, 10) || 10,
      },
    },
    qualities: [
      {
        label: '1080p',
        width: 1920,
        height: 1080,
        bitrate: parseInt(process.env.QUALITY_1080P_BITRATE, 10) || 5000,
      },
      {
        label: '720p',
        width: 1280,
        height: 720,
        bitrate: parseInt(process.env.QUALITY_720P_BITRATE, 10) || 2800,
      },
      {
        label: '480p',
        width: 854,
        height: 480,
        bitrate: parseInt(process.env.QUALITY_480P_BITRATE, 10) || 1500,
      },
    ],
  },
  rateLimiting: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
  monitoring: {
    enableMetrics: process.env.ENABLE_METRICS === 'true',
    metricsPort: parseInt(process.env.METRICS_PORT, 10) || 9090,
    healthCheckInterval:
      parseInt(process.env.HEALTH_CHECK_INTERVAL, 10) || 30000,
    logLevel: process.env.LOG_LEVEL || 'info',
    enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true',
  },
  security: {
    enableHelmet: process.env.ENABLE_HELMET !== 'false',
    enableCors: process.env.ENABLE_CORS !== 'false',
    trustedProxies: process.env.TRUSTED_PROXIES?.split(',') || [],
    sessionSecret: process.env.SESSION_SECRET || 'default-secret',
    csrf: process.env.CSRF_ENABLED !== 'false',
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
  },
}));
