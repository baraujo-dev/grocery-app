import dev from './dev';
import test from './test';
import prod from './prod';
import type { AppConfig } from '@grocery/shared';

const env = process.env.EXPO_PUBLIC_APP_ENV;

const config: AppConfig = env === 'prod' ? prod : env === 'test' ? test : dev;

export default config;
