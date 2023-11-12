export const esBuildConfig = {
  bundle: true,
  minify: false,
  sourcemap: true,
  exclude: ['@aws-sdk'],
  target: 'node18',
  define: { 'require.resolve': undefined },
  platform: 'node',
  concurrency: 10,
};
