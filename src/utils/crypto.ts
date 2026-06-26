import crypto from "crypto";
import { CustomError } from "../errors/customError.error";

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;
const KEY_LENGTH = 32;

function getMasterKey(): Buffer {
  const key = process.env.P12_MASTER_KEY;

  if (!key) {
    throw new CustomError("P12_MASTER_KEY is not configured", 500);
  }

  const buffer = Buffer.from(key, "utf-8");

  if (buffer.length < KEY_LENGTH) {
    return crypto.scryptSync(key, "salt", KEY_LENGTH);
  }

  return buffer.slice(0, KEY_LENGTH);
}

export interface EncryptedFile {
  data: Buffer;
  iv: string;
}

export function encryptFile(buffer: Buffer): EncryptedFile {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getMasterKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

  return {
    data: encrypted,
    iv: iv.toString("hex"),
  };
}

export function decryptFile(encrypted: EncryptedFile): Buffer {
  const key = getMasterKey();
  const iv = Buffer.from(encrypted.iv, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  return Buffer.concat([decipher.update(encrypted.data), decipher.final()]);
}

export function encryptText(text: string): { encrypted: string; iv: string } {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getMasterKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf-8"),
    cipher.final(),
  ]).toString("hex");

  return {
    encrypted,
    iv: iv.toString("hex"),
  };
}

export function decryptText(payload: {
  encrypted: string;
  iv: string;
}): string {
  const key = getMasterKey();
  const iv = Buffer.from(payload.iv, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.encrypted, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf-8");
}
