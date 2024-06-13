module.exports = {
  apps: [
    {
      name: 'pcpartdb-api',
      cwd: './packages/api',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--max-old-space-size=768',
      },
    },
    {
      name: 'pcpartdb-website',
      cwd: './packages/website',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--max-old-space-size=768',
      },
    },
  ],
};
