import { webcrypto } from "node:crypto";

// Vitest's "node" environment (used via `// @vitest-environment node` in
// individual test files) runs in a vm context that doesn't inherit Node's
// lazily-initialized global `crypto`, which `jose` needs to sign/verify JWTs.
if (!globalThis.crypto) {
  // @ts-expect-error -- polyfilling the missing global for this test context
  globalThis.crypto = webcrypto;
}
