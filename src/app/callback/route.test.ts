import { handleAuth } from '@workos-inc/authkit-nextjs';

jest.mock('@workos-inc/authkit-nextjs', () => ({
  handleAuth: jest.fn(),
}));

describe('callback/route', () => {
  describe('GET', () => {
    it('should be the result of handleAuth', () => {
      const mockHandler = jest.fn().mockResolvedValue({ body: 'OK' });
      (handleAuth as jest.MockedFunction<typeof handleAuth>).mockReturnValue(mockHandler);

      // Re-import to get the mocked version
      const { GET: getHandler } = require('./route');

      expect(handleAuth).toHaveBeenCalled();
      expect(getHandler).toBe(mockHandler);
    });
  });
});
