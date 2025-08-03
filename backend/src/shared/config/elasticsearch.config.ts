import { registerAs } from '@nestjs/config';

export default registerAs('elasticsearch', () => ({
  useElasticsearch: process.env.USE_ELASTIC_SEARCH === 'true',
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  index: process.env.ELASTICSEARCH_INDEX || 'videos',
  username: process.env.ELASTICSEARCH_USERNAME,
  password: process.env.ELASTICSEARCH_PASSWORD,
}));
