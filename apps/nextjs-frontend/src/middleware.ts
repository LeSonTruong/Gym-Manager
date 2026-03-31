import createMiddleware from 'next-intl/middleware';
import {NextResponse, type MiddlewareConfig, type NextRequest} from 'next/server';
import {routing} from './i18n/routing.ts';

const handleI18nRouting = createMiddleware(routing);
const refreshTokenCookieName = 'gym_refresh_token';

export default function middleware(request: NextRequest): Response {
  const response = handleI18nRouting(request);

  if (response.headers.get('location')) {
    return response;
  }

  const localeSegment = request.nextUrl.pathname.split('/').find(Boolean);
  const locale = routing.locales.find((candidateLocale) => candidateLocale === localeSegment)
    ?? routing.defaultLocale;
  const isLoginPath = request.nextUrl.pathname === `/${locale}/login`;
  const hasSessionCookie = Boolean(
    request.cookies.get(refreshTokenCookieName)?.value,
  );

  if (!hasSessionCookie && !isLoginPath) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return response;
}

export const config: MiddlewareConfig = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    // eslint-disable-next-line unicorn/prefer-string-raw
    '/((?!api|trpc|_next|_vercel)(?!.*\\..*).*)',
  ],
};
