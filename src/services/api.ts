import { ApiService } from '@/types';
import { createMockUserService, createMockAIService, createMockDiaryService } from './mock';

// API service factory - can be switched between mock and production
export const createApiService = (mode: 'mock' | 'production' = 'mock'): ApiService => {
  if (mode === 'production') {
    // Future implementation: return production services
    throw new Error('Production API not implemented yet');
  }
  
  return {
    users: createMockUserService(),
    ai: createMockAIService(),
    diary: createMockDiaryService()
  };
};

// Global API service instance
export const apiService = createApiService('mock');