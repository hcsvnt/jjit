import type { NextConfig } from 'next';
import initializeBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = initializeBundleAnalyzer({
    enabled: process.env.ANALYZE_BUNDLE === 'true',
});

const nextConfig: NextConfig = {
    output: 'standalone', // for docker deployment
    reactProductionProfiling: false,
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
            },
        ],
    },
};

export default withBundleAnalyzer(nextConfig);
