const SESSION_IDEMPOTENCY_KEY = '__CHECKOUT_IDEMPOTENCY_KEY__';

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback RFC4122 v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getOrCreateIdempotencyKey(): string {
  if (typeof window === 'undefined') return generateUUID();

  let key = sessionStorage.getItem(SESSION_IDEMPOTENCY_KEY);
  if (!key) {
    key = generateUUID();
    sessionStorage.setItem(SESSION_IDEMPOTENCY_KEY, key);
  }
  return key;
}

export function clearIdempotencyKey(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SESSION_IDEMPOTENCY_KEY);
  }
}
