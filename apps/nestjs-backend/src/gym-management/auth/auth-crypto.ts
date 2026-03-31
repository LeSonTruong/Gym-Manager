import { Buffer } from 'node:buffer';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const scryptKeyLength = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, scryptKeyLength).toString('hex');

  return `scrypt$${salt}$${derivedKey}`;
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  if (!passwordHash.startsWith('scrypt$')) {
    return password === passwordHash;
  }

  const [algorithm, salt, derivedKey] = passwordHash.split('$');

  if (algorithm !== 'scrypt' || !salt || !derivedKey) {
    return false;
  }

  const candidate = scryptSync(password, salt, derivedKey.length / 2).toString('hex');

  return timingSafeEqual(
    Buffer.from(candidate, 'hex'),
    Buffer.from(derivedKey, 'hex'),
  );
}

export function hashOpaqueToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
