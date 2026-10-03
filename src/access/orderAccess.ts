export const ACCESS_SESSION_KEY = 'fwti-access-session-v1';
export const DEVICE_BINDING_KEY = 'fwti-device-order-binding-v1';
export const ORDER_PATTERN = /^P\d{18}$/;

export type AccessKind = 'order' | 'admin';
export type OrderVerification = 'verified' | 'not-allowed' | 'device-mismatch';

type AccessRegistry = {
  version: 1;
  allowedOrderHashes: string[];
  adminAccessHash: string;
};

let registryPromise: Promise<AccessRegistry> | null = null;

export function normalizeOrderNumber(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/[０-９]/g, (char) => String(char.charCodeAt(0) - 0xfee0));
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

async function loadRegistry(): Promise<AccessRegistry> {
  if (!registryPromise) {
    registryPromise = fetch(`${import.meta.env.BASE_URL}access-registry.json`, {
      cache: 'no-store',
      credentials: 'same-origin',
    }).then(async (response) => {
      if (!response.ok) throw new Error('Access registry unavailable');
      const data = (await response.json()) as Partial<AccessRegistry>;
      if (
        data.version !== 1 ||
        !Array.isArray(data.allowedOrderHashes) ||
        typeof data.adminAccessHash !== 'string'
      ) {
        throw new Error('Access registry is invalid');
      }
      return data as AccessRegistry;
    });
  }
  return registryPromise;
}

export function hasOrderAccess(): boolean {
  if (typeof sessionStorage === 'undefined') return false;
  try {
    const raw = sessionStorage.getItem(ACCESS_SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { version?: number; kind?: string };
    return (
      parsed.version === 1 &&
      (parsed.kind === 'order' || parsed.kind === 'admin')
    );
  } catch {
    return false;
  }
}

export function grantOrderAccess(kind: AccessKind): void {
  try {
    sessionStorage.setItem(
      ACCESS_SESSION_KEY,
      JSON.stringify({ version: 1, kind, verifiedAt: Date.now() }),
    );
  } catch {
    // Private browsing can block storage; the current in-memory session still opens.
  }
}

export async function verifyOrderNumber(orderNumber: string): Promise<OrderVerification> {
  const normalized = normalizeOrderNumber(orderNumber);
  if (!ORDER_PATTERN.test(normalized)) return 'not-allowed';
  const [registry, fingerprint] = await Promise.all([
    loadRegistry(),
    sha256(normalized),
  ]);
  if (!registry.allowedOrderHashes.includes(fingerprint)) return 'not-allowed';

  try {
    const boundFingerprint = localStorage.getItem(DEVICE_BINDING_KEY);
    if (boundFingerprint && boundFingerprint !== fingerprint) {
      return 'device-mismatch';
    }
    if (!boundFingerprint) {
      localStorage.setItem(DEVICE_BINDING_KEY, fingerprint);
    }
  } catch {
    // Some private-browsing modes block persistent storage; allow the valid order
    // for this session, but it cannot be persistently device-bound there.
  }

  return 'verified';
}

export async function verifyAdminPassphrase(passphrase: string): Promise<boolean> {
  const normalized = passphrase.trim();
  if (!normalized) return false;
  const [registry, fingerprint] = await Promise.all([
    loadRegistry(),
    sha256(normalized),
  ]);
  return fingerprint === registry.adminAccessHash;
}
