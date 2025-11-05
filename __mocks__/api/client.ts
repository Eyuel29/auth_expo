/**
 * Mock API Client
 * Provides a mock axios instance for testing
 */

const mockApiClient = {
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
};

export const apiClient = mockApiClient;
