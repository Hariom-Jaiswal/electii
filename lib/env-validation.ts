/**
 * Validates that all required environment variables are set.
 * Called at the start of each API request to fail fast with a clear error.
 */

const REQUIRED_ENV_VARS = [
  'GEMINI_API_KEY',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
] as const;

export function validateEnv(): void {
  const missing: string[] = [];

  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]?.trim()) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        `Please check your .env.local file. See .env.example for reference.`
    );
  }
}

export { REQUIRED_ENV_VARS };
