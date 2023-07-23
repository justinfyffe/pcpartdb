/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNextJsObfuscator = require('nextjs-obfuscator')({
  disableConsoleOutput: false,
});

module.exports = withBundleAnalyzer(
  withNextJsObfuscator({
    redirects: () => [
      { source: '/gpus', destination: '/gpus/list', permanent: false },
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
    transpilePackages: ['@pcpartdb/shared'],
  }),
);
