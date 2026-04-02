import process from 'node:process';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 0,
  use: {
    // Required Playwright option name.
    // eslint-disable-next-line @typescript-eslint/naming-convention
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    headless: true,
  },
  webServer: [
    {
      command: 'npm run start:dev',
      cwd: '../nestjs-backend',
      port: 4000,
      reuseExistingServer: true,
      timeout: 120_000,
      // Required runtime env variable names for backend bootstrapping.
      /* eslint-disable @typescript-eslint/naming-convention */
      env: {
        ...process.env,
        FRONTEND_HOST: process.env.FRONTEND_HOST ?? 'http://localhost:3000',
        PORT: process.env.PORT ?? '4000',
        POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME ?? ':memory:',
        POSTGRES_HOST: process.env.POSTGRES_HOST ?? 'sqlite',
        REDIS_HOST: process.env.REDIS_HOST ?? 'memory',
      },
      /* eslint-enable @typescript-eslint/naming-convention */
    },
    {
      command: 'npm run start:dev',
      port: 3000,
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
});
