// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("server-only", () => ({}));

const { cookieStore, setCookie, deleteCookie } = vi.hoisted(() => {
  const cookieStore = new Map<string, { value: string }>();
  return {
    cookieStore,
    setCookie: vi.fn((name: string, value: string) => {
      cookieStore.set(name, { value });
    }),
    deleteCookie: vi.fn((name: string) => {
      cookieStore.delete(name);
    }),
  };
});

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    set: setCookie,
    get: (name: string) => cookieStore.get(name),
    delete: deleteCookie,
  })),
}));

const { createSession, getSession, deleteSession, verifySession } = await import(
  "@/lib/auth"
);

function requestWithCookie(value?: string) {
  const headers = new Headers();
  if (value !== undefined) {
    headers.set("cookie", `auth-token=${value}`);
  }
  return new NextRequest("http://localhost/api/projects", { headers });
}

beforeEach(() => {
  cookieStore.clear();
  setCookie.mockClear();
  deleteCookie.mockClear();
});

describe("createSession", () => {
  it("signs a JWT and stores it in an httpOnly auth-token cookie", async () => {
    await createSession("user-1", "user@example.com");

    expect(setCookie).toHaveBeenCalledTimes(1);
    const [name, token, options] = setCookie.mock.calls[0];

    expect(name).toBe("auth-token");
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
    expect(options).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
    expect(options.expires).toBeInstanceOf(Date);
    expect(options.expires.getTime()).toBeGreaterThan(Date.now());
  });
});

describe("getSession", () => {
  it("returns null when no cookie is set", async () => {
    expect(await getSession()).toBeNull();
  });

  it("returns the session payload for a valid token", async () => {
    await createSession("user-1", "user@example.com");

    const session = await getSession();

    expect(session).not.toBeNull();
    expect(session?.userId).toBe("user-1");
    expect(session?.email).toBe("user@example.com");
  });

  it("returns null for a malformed token", async () => {
    cookieStore.set("auth-token", { value: "not-a-valid-jwt" });

    expect(await getSession()).toBeNull();
  });
});

describe("deleteSession", () => {
  it("deletes the auth-token cookie", async () => {
    await createSession("user-1", "user@example.com");

    await deleteSession();

    expect(deleteCookie).toHaveBeenCalledWith("auth-token");
  });
});

describe("verifySession", () => {
  it("returns null when the request has no auth-token cookie", async () => {
    const request = requestWithCookie();

    expect(await verifySession(request)).toBeNull();
  });

  it("returns the session payload for a request with a valid token", async () => {
    await createSession("user-2", "user2@example.com");
    const token = setCookie.mock.calls[0][1];

    const session = await verifySession(requestWithCookie(token));

    expect(session?.userId).toBe("user-2");
    expect(session?.email).toBe("user2@example.com");
  });

  it("returns null for an invalid token", async () => {
    const request = requestWithCookie("garbage-token");

    expect(await verifySession(request)).toBeNull();
  });
});
