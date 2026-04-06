import Hashids from 'hashids';

// Salt ensures unique deterministic hashes.
// For production use process.env.HASH_SALT.
const HASH_SALT = process.env.HASH_SALT || "meal-app-secure-salt-x9v2";
// The ID will be around 8 characters long, well within the max 10 characters request.
const MIN_LENGTH = 8; 

const hashids = new Hashids(HASH_SALT, MIN_LENGTH);

/**
 * Encodes a numeric ID to a secure Hash string.
 */
export function encodeId(id: string | number): string {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(numId)) {
    throw new Error(`Invalid ID provided for encoding: ${id}`);
  }
  return hashids.encode(numId);
}

/**
 * Decodes a secure Hash string back to a numeric ID string.
 */
export function decodeId(hash: string): string | null {
  if (!hash) return null;
  const decodedArr = hashids.decode(hash);
  if (!decodedArr || decodedArr.length === 0) {
    return null;
  }
  return decodedArr[0].toString();
}
