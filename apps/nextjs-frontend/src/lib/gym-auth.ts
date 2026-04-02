import { AsyncLocalStorage } from "node:async_hooks";
import process from "node:process";
import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type ApiResponse, type DemoUser } from "@next-nest-turbo-boilerplate/shared";

type AuthPayload = {
  user: DemoUser;
  accessToken: string;
  refreshToken: string;
};

export type GymFrontendSession = {
  user: DemoUser;
  accessToken: string;
  refreshToken: string;
};

const refreshTokenCookieName = "gym_refresh_token";
const gymSessionStorage = new AsyncLocalStorage<GymFrontendSession>();

function getBackendUrl(): string {
  return (
    process.env.GYM_BACKEND_URL ??
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    "http://localhost:4000"
  ).replace(/\/$/v, "");
}

function hasAuthPayload(value: unknown): value is ApiResponse<AuthPayload> {
  return Boolean(value) && typeof value === "object" && "data" in value;
}

async function setRefreshTokenCookie(refreshToken: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(refreshTokenCookieName, refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearRefreshTokenCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(refreshTokenCookieName);
}

export async function loginToGymFrontend(
  email: string,
  password: string,
): Promise<GymFrontendSession> {
  const response = await fetch(`${getBackendUrl()}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  const payload: unknown = await response.json();

  if (!hasAuthPayload(payload)) {
    throw new TypeError("Unexpected login payload");
  }

  await setRefreshTokenCookie(payload.data.refreshToken);

  return payload.data;
}

export async function getOptionalGymSession(): Promise<GymFrontendSession | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(refreshTokenCookieName)?.value;

  if (!refreshToken) {
    return null;
  }

  let response: Response;

  try {
    response = await fetch(`${getBackendUrl()}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    // Backend might still be booting in dev; treat as no active session.
    return null;
  }

  if (!response.ok) {
    // Cookie mutation is only allowed in server actions/route handlers.
    // During render, simply treat the session as missing.
    return null;
  }

  const payload: unknown = await response.json();

  if (!hasAuthPayload(payload)) {
    return null;
  }

  return {
    user: payload.data.user,
    accessToken: payload.data.accessToken,
    refreshToken,
  };
}

export async function requireGymSession(
  locale: string,
): Promise<GymFrontendSession> {
  const session = await getOptionalGymSession();

  if (!session) {
    redirect(`/${locale}/login`);
  }

  return session;
}

export function runWithGymSession<Result>(
  session: GymFrontendSession,
  render: () => Result,
): Result {
  return gymSessionStorage.run(session, render);
}

export function getGymSession(): GymFrontendSession {
  const session = gymSessionStorage.getStore();

  if (!session) {
    throw new Error("Gym session is not available in the current render context");
  }

  return session;
}

export async function logoutFromGymFrontend(): Promise<void> {
  const session = await getOptionalGymSession();

  if (session) {
    const headers = new Headers();

    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${session.accessToken}`);

    try {
      await fetch(`${getBackendUrl()}/api/auth/logout`, {
        method: "POST",
        headers,
        cache: "no-store",
        body: JSON.stringify({ refreshToken: session.refreshToken }),
      });
    } catch {
      // Ignore logout propagation errors and always clear the frontend cookie.
    }
  }

  await clearRefreshTokenCookie();
}
