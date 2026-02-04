import type { NextConfig } from 'next';
import initializeBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = initializeBundleAnalyzer({
    enabled: process.env.ANALYZE_BUNDLE === 'true',
});

const nextConfig: NextConfig = {
    reactProductionProfiling: false,
    reactStrictMode: true,
};

export default withBundleAnalyzer(nextConfig);
