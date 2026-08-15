/**
 * Environment Variable Validation Module
 * Ensures mandatory env variables are present before application runtime.
 */

export interface EnvConfig {
  DATABASE_URL: string;
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
}

export function validateEnv(): EnvConfig {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL && process.env.NODE_ENV === 'production') {
    throw new Error('❌ FATAL: DATABASE_URL environment variable is missing!');
  }

  return {
    DATABASE_URL: DATABASE_URL || 'file:./dev.db',
    NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
  };
}

export const env = validateEnv();
