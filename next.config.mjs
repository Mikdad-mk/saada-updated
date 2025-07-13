/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Handle MongoDB optional dependencies
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        dns: false,
        'mongodb-client-encryption': false,
        'kerberos': false,
        '@mongodb-js/zstd': false,
        '@aws-sdk/credential-providers': false,
        'snappy': false,
        'aws4': false,
      };
    }

    // Ignore specific MongoDB modules that cause issues
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        'mongodb-client-encryption': 'mongodb-client-encryption',
        'kerberos': 'kerberos',
        '@mongodb-js/zstd': '@mongodb-js/zstd',
        '@aws-sdk/credential-providers': '@aws-sdk/credential-providers',
        'snappy': 'snappy',
        'aws4': 'aws4',
        'dns': 'dns',
      });
    }

    return config;
  },
  serverExternalPackages: ['mongodb'],
}

export default nextConfig
