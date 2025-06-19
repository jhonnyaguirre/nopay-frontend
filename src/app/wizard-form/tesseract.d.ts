// tesseract.d.ts
import 'tesseract.js';

declare module 'tesseract.js' {
  interface Worker {
    initialize(language: string): Promise<void>;
    loadLanguage(language: string): Promise<void>;
  }
}