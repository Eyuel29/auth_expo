/**
 * Mock Axios
 * Provides mock axios implementation for testing
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
const mockAxios: any = {
  create: jest.fn(function () {
    return mockAxios;
  }),
  defaults: {
    baseURL: 'http://localhost:8080',
    headers: {},
  },
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  isAxiosError: jest.fn((error: any) => error?.isAxiosError === true),
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export default mockAxios;
