
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const KEY_LENGTH = 256;
const PBKDF2_ITERATIONS = 100000;

// Utility to convert ArrayBuffer to string and back for filename storage
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

async function getCryptoKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const passwordBuffer = textEncoder.encode(password);
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encryptFile(file: File, password: string): Promise<ArrayBuffer> {
  const fileBuffer = await file.arrayBuffer();
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await getCryptoKey(password, salt);

  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    fileBuffer
  );

  const fileNameBuffer = textEncoder.encode(file.name);
  const fileNameLengthBuffer = new Uint8Array(2); // Using 2 bytes for filename length, max 65535 chars
  new DataView(fileNameLengthBuffer.buffer).setUint16(0, fileNameBuffer.length, false);

  const combinedBuffer = new Uint8Array(
    salt.length + iv.length + fileNameLengthBuffer.length + fileNameBuffer.length + ciphertext.byteLength
  );

  let offset = 0;
  combinedBuffer.set(salt, offset);
  offset += salt.length;
  combinedBuffer.set(iv, offset);
  offset += iv.length;
  combinedBuffer.set(fileNameLengthBuffer, offset);
  offset += fileNameLengthBuffer.length;
  combinedBuffer.set(fileNameBuffer, offset);
  offset += fileNameBuffer.length;
  combinedBuffer.set(new Uint8Array(ciphertext), offset);

  return combinedBuffer.buffer;
}

export async function decryptFile(encryptedData: ArrayBuffer, password: string): Promise<{decryptedBuffer: ArrayBuffer, originalFileName: string}> {
  try {
    const encryptedBytes = new Uint8Array(encryptedData);
    
    let offset = 0;
    const salt = encryptedBytes.slice(offset, offset + SALT_LENGTH);
    offset += SALT_LENGTH;
    const iv = encryptedBytes.slice(offset, offset + IV_LENGTH);
    offset += IV_LENGTH;

    const key = await getCryptoKey(password, salt);

    const fileNameLength = new DataView(encryptedBytes.buffer).getUint16(offset, false);
    offset += 2;
    
    const fileNameBuffer = encryptedBytes.slice(offset, offset + fileNameLength);
    const originalFileName = textDecoder.decode(fileNameBuffer);
    offset += fileNameLength;

    const ciphertext = encryptedBytes.slice(offset);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      ciphertext
    );

    return { decryptedBuffer, originalFileName };

  } catch (e) {
    console.error("Decryption failed:", e);
    throw new Error("Decryption failed. The password may be incorrect or the data corrupted.");
  }
}
