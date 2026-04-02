import { getRequestConfig } from 'next-intl/server';
import { type AbstractIntlMessages, hasLocale } from 'next-intl';
import { routing } from './routing.ts';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function hasDefaultMessages(
  value: unknown,
): value is { default: AbstractIntlMessages } {
  if (!isRecord(value)) {
    return false;
  }

  return isRecord(value.default);
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const localeJson: unknown = await import(`../../locales/${locale}.json`);

  if (!hasDefaultMessages(localeJson)) {
    throw new TypeError(`Invalid locale messages for ${locale}`);
  }

  return {
    locale,
    messages: localeJson.default,
  };
});
