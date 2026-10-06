/**
 * WebSocket polyfill for Node.js SSR — synchronous, no-import version.
 *
 * This module uses Function("return require")() to get the real Node.js require
 * function, bypassing Vite's module transforms. This is intentional and necessary
 * because Vite SSR transforms `require()` and `import()` in ways that prevent
 * the polyfill from running before Supabase's realtime module checks for WebSocket.
 *
 * This file must be imported BEFORE @supabase/supabase-js.
 */
const isNode =
  typeof globalThis !== "undefined" &&
  typeof globalThis.process !== "undefined" &&
  !!(globalThis as any).process?.versions?.node;

if (isNode && typeof globalThis.WebSocket === "undefined") {
  try {
    // Get the real Node.js require, unaffected by Vite's ESM transform
    // eslint-disable-next-line no-new-func
    const nodeRequire = new Function("return typeof require !== 'undefined' ? require : null")();
    if (nodeRequire) {
      const ws = nodeRequire("ws");
      const WsCtor = ws.WebSocket || ws.default || ws;
      if (typeof WsCtor === "function") {
        (globalThis as any).WebSocket = WsCtor;
      }
    }
  } catch {
    // ws not available — Supabase Realtime will fail, but direct DB queries still work
  }
}

export {};
