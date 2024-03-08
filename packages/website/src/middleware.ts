import {
  base64Encode,
  Config,
  CONFIG_HEADER,
  ERROR_HEADER,
  HttpErrorType,
} from '@pcpartdb/shared';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from './app/_common/api/ApiClient';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon|images).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

export async function middleware(request: NextRequest) {
  const config = await apiClient.get<Config>('config', {
    headers: { Cookie: cookies().toString() },
  });

  let response: NextResponse;
  // Forgot Password Middleware
  if (request.nextUrl.pathname.startsWith('/forgot-password/')) {
    // Only guests can reset password.
    response = forgotPasswordMiddleware(config);
  }
  // Login Middleware
  if (request.nextUrl.pathname.startsWith('/login/')) {
    // Only guests can login.
    response = loginMiddleware(request, config);
  }
  // Register Middleware
  if (request.nextUrl.pathname.startsWith('/register/')) {
    // Only guests can register.
    response = registerMiddleware(request, config);
  }
  // Reset Password Middleware
  if (request.nextUrl.pathname.startsWith('/reset-password/')) {
    // Only guests can reset password.

    response = resetPasswordMiddleware(request, config);
  }

  // Fallback Middleware
  if (response == null) {
    response = NextResponse.next();
  }

  // Add common headers
  response.headers.set(CONFIG_HEADER, base64Encode(config));

  return response;
}

function forgotPasswordMiddleware(config: Config) {
  let response: NextResponse;

  // Only guests can login.
  if (config.user != null) {
    response = NextResponse.next({ status: 403 });
    response.headers.set(
      ERROR_HEADER,
      base64Encode({ type: HttpErrorType.ForbiddenError }),
    );
  }

  return response;
}

function loginMiddleware(request: NextRequest, config: Config) {
  let response: NextResponse;

  // Only guests can login.
  if (config.user != null) {
    response = NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

function registerMiddleware(request: NextRequest, config: Config) {
  let response: NextResponse;

  // Only guests can login.
  if (config.user != null) {
    response = NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

function resetPasswordMiddleware(request: NextRequest, config: Config) {
  let response: NextResponse;

  // Only guests can login.
  if (config.user != null) {
    response = NextResponse.redirect(new URL('/', request.url));
  } else if (!request.nextUrl.searchParams.has('token')) {
    response = NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}
