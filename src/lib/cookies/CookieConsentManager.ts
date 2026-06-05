export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = "nopay_cookie_consent";

export class CookieConsentManager {
  static save(preferences: CookiePreferences) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(preferences)
    );
  }

  static get(): CookiePreferences | null {
    if (typeof window === "undefined") return null;

    const value = localStorage.getItem(STORAGE_KEY);

    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  static hasConsent(): boolean {
    return this.get() !== null;
  }

  static clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
}