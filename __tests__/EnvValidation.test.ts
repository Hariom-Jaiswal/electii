import { validateEnv, REQUIRED_ENV_VARS } from '@/lib/env-validation';

describe('validateEnv', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Clone env and clear required keys for each test
    process.env = { ...originalEnv };
    for (const key of REQUIRED_ENV_VARS) {
      delete process.env[key];
    }
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('throws an error when all required env vars are missing', () => {
    expect(() => validateEnv()).toThrow(/Missing required environment variables/);
  });

  it('includes the names of all missing variables in the error message', () => {
    expect(() => validateEnv()).toThrow('GEMINI_API_KEY');
  });

  it('throws when only some env vars are set', () => {
    process.env.GEMINI_API_KEY = 'test-key';
    expect(() => validateEnv()).toThrow('NEXT_PUBLIC_FIREBASE_API_KEY');
  });

  it('throws when a required env var is set but empty (whitespace only)', () => {
    for (const key of REQUIRED_ENV_VARS) {
      process.env[key] = '   ';
    }
    expect(() => validateEnv()).toThrow(/Missing required environment variables/);
  });

  it('does not throw when all required env vars are set', () => {
    for (const key of REQUIRED_ENV_VARS) {
      process.env[key] = 'valid-test-value';
    }
    expect(() => validateEnv()).not.toThrow();
  });

  it('exports the REQUIRED_ENV_VARS list', () => {
    expect(REQUIRED_ENV_VARS).toContain('GEMINI_API_KEY');
    expect(REQUIRED_ENV_VARS).toContain('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  });
});
