export const dynamoDbLocalConfig = {
  stages: ['dev'],
  start: {
    port: 8000,
    inMemory: true,
    migrate: true,
    seed: false,
  },
  migration: {
    dir: 'offline/migrations',
  },
};
