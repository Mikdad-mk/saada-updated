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
    // Handle MongoDB optional dependencies for client-side
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

    return config;
  },
  serverExternalPackages: ['mongodb'],
}

export default nextConfig
