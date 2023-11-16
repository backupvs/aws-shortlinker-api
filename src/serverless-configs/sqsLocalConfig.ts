export const sqsLocalConfig = {
  autoCreate: true,
  apiVersion: '2012-11-05',
  endpoint: 'http://0.0.0.0:9324',
  region: '${self:provider.region}',
  accessKeyId: 'root',
  secretAccessKey: 'root',
  skipCacheInvalidation: false,
};
