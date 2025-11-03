/**
 * Global type declarations
 */

// Extend the Window interface for web platform
declare global {
  interface Window {
    confirm: (message?: string) => boolean;
  }
}

export {};

