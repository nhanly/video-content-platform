import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3: {
    bucket: process.env.AWS_S3_BUCKET_NAME,
    region: process.env.AWS_S3_REGION || 'us-east-1',
  },
  mediaConvert: {
    endpoint: process.env.AWS_MEDIACONVERT_ENDPOINT,
    role: process.env.AWS_MEDIACONVERT_ROLE,
  },
}));
