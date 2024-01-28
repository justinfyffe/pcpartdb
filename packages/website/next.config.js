/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  redirects: () => [
    { source: '/cpus', destination: '/cpus/list', permanent: false },
    { source: '/gpus', destination: '/gpus/list', permanent: false },

    // Deprecated paths
    {
      source: '/cpus/list/best-value',
      destination: '/cpus/list/best-performance-per-dollar',
      permanent: true,
    },
    {
      source: '/cpus/list/best-value-amd',
      destination: '/cpus/list/best-performance-per-dollar-amd',
      permanent: true,
    },
    {
      source: '/cpus/list/best-value-intel',
      destination: '/cpus/list/best-performance-per-dollar-intel',
      permanent: true,
    },
    {
      source: '/gpus/list/best-value',
      destination: '/gpus/list/best-performance-per-dollar',
      permanent: true,
    },
    {
      source: '/gpus/list/best-value-amd',
      destination: '/gpus/list/best-performance-per-dollar-amd',
      permanent: true,
    },
    {
      source: '/gpus/list/best-value-nvidia',
      destination: '/gpus/list/best-performance-per-dollar-nvidia',
      permanent: true,
    },
  ],
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  // The starter code load resources from `public` folder with `router.basePath` in React components.
  // So, the source code is "basePath-ready".
  // You can remove `basePath` if you don't need it.
  reactStrictMode: false,
  experimental: {
    // this will allow nextjs to resolve files (js, ts, css)
    // outside packages/app directory.
    externalDir: true,
  },
});
