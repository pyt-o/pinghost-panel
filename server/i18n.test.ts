import { describe, expect, it } from "vitest";
import { getTranslation, getAllTranslations, translations } from "../shared/translations";
import type { Language } from "../shared/translations";

describe("i18n - Translations", () => {
  describe("getTranslation", () => {
    it("should return Polish translation for valid key", () => {
      const result = getTranslation('pl', 'common.app_name');
      expect(result).toBe('PingHost Panel');
    });

    it("should return English translation for valid key", () => {
      const result = getTranslation('en', 'common.app_name');
      expect(result).toBe('PingHost Panel');
    });

    it("should return key if translation not found", () => {
      const result = getTranslation('pl', 'nonexistent.key');
      expect(result).toBe('nonexistent.key');
    });

    it("should handle nested keys correctly", () => {
      const result = getTranslation('pl', 'admin.dashboard_title');
      expect(result).toBe('Dashboard Administracyjny');
    });

    it("should return English translation for nested keys", () => {
      const result = getTranslation('en', 'admin.dashboard_title');
      expect(result).toBe('Admin Dashboard');
    });

    it("should handle common translations", () => {
      const plResult = getTranslation('pl', 'common.logout');
      const enResult = getTranslation('en', 'common.logout');
      expect(plResult).toBe('Wyloguj się');
      expect(enResult).toBe('Logout');
    });

    it("should handle navigation translations", () => {
      const plResult = getTranslation('pl', 'nav.dashboard');
      const enResult = getTranslation('en', 'nav.dashboard');
      expect(plResult).toBe('Dashboard');
      expect(enResult).toBe('Dashboard');
    });

    it("should handle user management translations", () => {
      const plResult = getTranslation('pl', 'users.title');
      const enResult = getTranslation('en', 'users.title');
      expect(plResult).toBe('Zarządzanie Użytkownikami');
      expect(enResult).toBe('User Management');
    });

    it("should handle server translations", () => {
      const plResult = getTranslation('pl', 'servers.running');
      const enResult = getTranslation('en', 'servers.running');
      expect(plResult).toBe('Uruchomiony');
      expect(enResult).toBe('Running');
    });

    it("should handle credit translations", () => {
      const plResult = getTranslation('pl', 'credits.balance');
      const enResult = getTranslation('en', 'credits.balance');
      expect(plResult).toBe('Saldo Kredytów');
      expect(enResult).toBe('Credit Balance');
    });

    it("should handle settings translations", () => {
      const plResult = getTranslation('pl', 'settings.language_preference');
      const enResult = getTranslation('en', 'settings.language_preference');
      expect(plResult).toBe('Preferencja Języka');
      expect(enResult).toBe('Language Preference');
    });
  });

  describe("getAllTranslations", () => {
    it("should return all Polish translations", () => {
      const result = getAllTranslations('pl');
      expect(result).toBeDefined();
      expect(result.common).toBeDefined();
      expect(result.common.app_name).toBe('PingHost Panel');
    });

    it("should return all English translations", () => {
      const result = getAllTranslations('en');
      expect(result).toBeDefined();
      expect(result.common).toBeDefined();
      expect(result.common.app_name).toBe('PingHost Panel');
    });

    it("should have same structure for both languages", () => {
      const pl = getAllTranslations('pl');
      const en = getAllTranslations('en');
      
      expect(Object.keys(pl)).toEqual(Object.keys(en));
      expect(Object.keys(pl.common)).toEqual(Object.keys(en.common));
      expect(Object.keys(pl.nav)).toEqual(Object.keys(en.nav));
    });
  });

  describe("Translation Coverage", () => {
    it("should have translations for all admin sections", () => {
      const sections = ['dashboard_title', 'total_users', 'total_servers', 'open_tickets'];
      sections.forEach(section => {
        const pl = getTranslation('pl', `admin.${section}`);
        const en = getTranslation('en', `admin.${section}`);
        expect(pl).not.toBe(`admin.${section}`);
        expect(en).not.toBe(`admin.${section}`);
      });
    });

    it("should have translations for all user sections", () => {
      const sections = ['welcome', 'manage_servers', 'add_credits'];
      sections.forEach(section => {
        const pl = getTranslation('pl', `user.${section}`);
        const en = getTranslation('en', `user.${section}`);
        expect(pl).not.toBe(`user.${section}`);
        expect(en).not.toBe(`user.${section}`);
      });
    });

    it("should have translations for all common actions", () => {
      const actions = ['save', 'cancel', 'delete', 'edit', 'create'];
      actions.forEach(action => {
        const pl = getTranslation('pl', `common.${action}`);
        const en = getTranslation('en', `common.${action}`);
        expect(pl).not.toBe(`common.${action}`);
        expect(en).not.toBe(`common.${action}`);
      });
    });

    it("should have translations for all message types", () => {
      const messages = ['loading', 'error_loading', 'error_saving', 'unauthorized'];
      messages.forEach(msg => {
        const pl = getTranslation('pl', `messages.${msg}`);
        const en = getTranslation('en', `messages.${msg}`);
        expect(pl).not.toBe(`messages.${msg}`);
        expect(en).not.toBe(`messages.${msg}`);
      });
    });
  });

  describe("Language Support", () => {
    it("should support Polish language", () => {
      expect(translations['pl']).toBeDefined();
      expect(Object.keys(translations['pl']).length).toBeGreaterThan(0);
    });

    it("should support English language", () => {
      expect(translations['en']).toBeDefined();
      expect(Object.keys(translations['en']).length).toBeGreaterThan(0);
    });

    it("should have consistent translation keys", () => {
      const plKeys = Object.keys(translations['pl']);
      const enKeys = Object.keys(translations['en']);
      expect(plKeys).toEqual(enKeys);
    });
  });

  describe("Credit Package Translations", () => {
    it("should have Polish credit package translations", () => {
      const credits100 = getTranslation('pl', 'credits.credit_packages.credits_100');
      const credits500 = getTranslation('pl', 'credits.credit_packages.credits_500');
      expect(credits100).toBe('100 Kredytów');
      expect(credits500).toBe('500 Kredytów');
    });

    it("should have English credit package translations", () => {
      const credits100 = getTranslation('en', 'credits.credit_packages.credits_100');
      const credits500 = getTranslation('en', 'credits.credit_packages.credits_500');
      expect(credits100).toBe('100 Credits');
      expect(credits500).toBe('500 Credits');
    });

    it("should have most popular label in both languages", () => {
      const plPopular = getTranslation('pl', 'credits.credit_packages.most_popular');
      const enPopular = getTranslation('en', 'credits.credit_packages.most_popular');
      expect(plPopular).toBe('NAJPOPULARNIEJSZY');
      expect(enPopular).toBe('MOST POPULAR');
    });
  });
});
