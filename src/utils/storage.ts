/**
 * Crash-proof persistence helpers.
 *
 * localStorage is NOT always available: sandboxed iframes (no allow-same-origin),
 * Safari private mode, "block third-party cookies" settings and some corporate
 * policies all make `window.localStorage` throw a SecurityError on *access*.
 * Reading it inside a `useState` initializer used to take the whole React tree
 * down and leave the user staring at a blank page. Every access now goes
 * through these helpers, which degrade gracefully to in-memory storage.
 */

const memoryStore = new Map<string, string>();

export const APP_STORAGE_KEYS = [
  'minecontrol_bots',
  'minecontrol_servers',
  'minecontrol_waypoints',
  'minecontrol_routes',
  'minecontrol_profiles',
  'minecontrol_rules',
] as const;

/** Returns localStorage if it is actually usable, otherwise null. */
function getStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    const ls = window.localStorage;
    if (!ls) return null;
    // Probe: some environments expose the object but throw on use.
    const probe = '__minecontrol_probe__';
    ls.setItem(probe, '1');
    ls.removeItem(probe);
    return ls;
  } catch {
    return null;
  }
}

export function isStorageAvailable(): boolean {
  return getStorage() !== null;
}

export function readRaw(key: string): string | null {
  const ls = getStorage();
  if (!ls) return memoryStore.get(key) ?? null;
  try {
    return ls.getItem(key);
  } catch {
    return memoryStore.get(key) ?? null;
  }
}

export function writeRaw(key: string, value: string): void {
  const ls = getStorage();
  if (!ls) {
    memoryStore.set(key, value);
    return;
  }
  try {
    ls.setItem(key, value);
  } catch {
    // Quota exceeded / storage disabled mid-session — keep it in memory only.
    memoryStore.set(key, value);
  }
}

export function removeRaw(key: string): void {
  memoryStore.delete(key);
  const ls = getStorage();
  if (!ls) return;
  try {
    ls.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** Wipe every key this app owns (used by the Error Boundary "reset" action). */
export function clearAppStorage(): void {
  APP_STORAGE_KEYS.forEach(removeRaw);
  memoryStore.clear();
}

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * Recursively re-hydrate a saved value on top of its default shape.
 *
 * This is what makes saved state forward/backward compatible: if a previous
 * version of the app persisted a bot without `mining.stats`, or the user's
 * JSON was hand-edited, the missing branches are filled from the defaults
 * instead of exploding in a view with "cannot read properties of undefined".
 *
 * Type mismatches (a number where an object is expected, etc.) fall back to
 * the default value so bad data can never reach the render tree.
 */
export function hydrateDefaults<T>(defaults: T, saved: unknown): T {
  if (saved === undefined || saved === null) return defaults;

  if (Array.isArray(defaults)) {
    if (!Array.isArray(saved)) return defaults;
    const template: unknown = (defaults as unknown[])[0];
    const merged: unknown[] = [];

    for (const item of saved) {
      if (item === undefined || item === null) continue;

      if (template === undefined) {
        merged.push(item);
        continue;
      }

      if (isPlainObject(template)) {
        // Collections of records (bots, servers, waypoints, profiles, rules):
        // anything that is not an object is dropped instead of leaking into
        // the render tree as a value with no fields.
        if (!isPlainObject(item)) continue;
        const hydrated = hydrateDefaults(template, item);
        // Every record in this app is addressed by a string `id`; entries
        // without one cannot be rendered or updated safely.
        const id = (hydrated as Record<string, unknown>).id;
        if (typeof id !== 'string' || id.length === 0) continue;
        merged.push(hydrated);
        continue;
      }

      // Arrays of primitives (string lists, numbers, ...).
      if (typeof item === typeof template) merged.push(item);
    }

    return merged as unknown as T;
  }

  if (isPlainObject(defaults)) {
    if (!isPlainObject(saved)) return defaults;
    const out: Record<string, unknown> = { ...(defaults as Record<string, unknown>) };
    for (const key of Object.keys(saved)) {
      const defVal = (defaults as Record<string, unknown>)[key];
      const savedVal = saved[key];
      if (defVal === undefined) {
        // Unknown/extra key (e.g. from a newer build) — keep it as-is.
        out[key] = savedVal;
      } else {
        out[key] = hydrateDefaults(defVal, savedVal);
      }
    }
    return out as T;
  }

  return typeof saved === typeof defaults ? (saved as T) : defaults;
}

/**
 * Safely read + parse + hydrate a persisted collection.
 * Any failure (missing, malformed JSON, wrong shape) returns the defaults.
 */
export function loadPersisted<T>(key: string, defaults: T): T {
  const raw = readRaw(key);
  if (!raw) return defaults;
  try {
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined) return defaults;
    return hydrateDefaults(defaults, parsed);
  } catch {
    // Corrupt payload — drop it so the app can boot cleanly next time.
    removeRaw(key);
    return defaults;
  }
}

/** Safely persist a value. Never throws. */
export function savePersisted(key: string, value: unknown): void {
  try {
    writeRaw(key, JSON.stringify(value));
  } catch {
    /* circular payload / quota — nothing we can do, keep the UI alive */
  }
}
