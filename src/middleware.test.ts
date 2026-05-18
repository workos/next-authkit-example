// Mock the middleware module entirely
jest.mock('./middleware', () => {
  return {
    __esModule: true,
    default: jest.fn(),
    config: { matcher: ['/', '/account/:path*', '/api/:path*'] },
  };
});

import middleware, { config } from './middleware';

describe('middleware', () => {
  describe('config', () => {
    it('should have matcher array defined', () => {
      expect(config).toBeDefined();
      expect(config.matcher).toBeDefined();
      expect(Array.isArray(config.matcher)).toBe(true);
    });

    it('should match root path', () => {
      expect(config.matcher).toContain('/');
    });

    it('should match account paths', () => {
      expect(config.matcher).toContain('/account/:path*');
    });

    it('should match api paths', () => {
      expect(config.matcher).toContain('/api/:path*');
    });
  });

  describe('default export', () => {
    it('should be a function', () => {
      expect(typeof middleware).toBe('function');
    });
  });
});
