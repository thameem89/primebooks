import type {NextConfig} from 'next';
// Small local catalogue: resolve metadata before streaming so missing titles return HTTP 404.
const config:NextConfig={htmlLimitedBots:/.*/};
export default config;
