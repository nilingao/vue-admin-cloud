import { decrypt as aesDecrypt, encrypt as aesEncrypt } from 'crypto-js/aes';
import Base64 from 'crypto-js/enc-base64';
import UTF8, { parse } from 'crypto-js/enc-utf8';
import { mode } from 'crypto-js/index';
import MD5 from 'crypto-js/md5';
import pkcs7 from 'crypto-js/pad-pkcs7';
import SHA256 from 'crypto-js/sha256';
import SHA512 from 'crypto-js/sha512';

// Define an interface for encryption
// 定义一个加密器的接口
export interface Encryption {
  encrypt(plainText: string): string;
  decrypt(cipherText: string): string;
}
// Define an interface for Hashing
// 定义一个哈希算法的接口
export interface Hashing {
  hash(data: string): string;
}
export interface EncryptionParams {
  key?: string;
  iv?: string;
  md?: any;
}

export interface EncryptionFactory {
  createAesEncryption(params?: EncryptionParams): Encryption;
  createBase64Encryption(): Encryption;
}

export interface HashingFactory {
  createMD5Hashing(): Hashing;
  createSHA256Hashing(): Hashing;
  createSHA512Hashing(): Hashing;
}

class AesEncryption implements Encryption {
  private static instance: any;
  get getOptions() {
    return {
      mode: this.md,
      padding: pkcs7,
      iv: this.iv,
    };
  }
  private readonly iv;
  private readonly key;

  private readonly md;

  constructor({
    key = import.meta.env.VITE_APP_SECRET_KEY,
    iv = import.meta.env.VITE_APP_SECRET_IV,
    md = mode.CBC,
  }: EncryptionParams) {
    this.key = parse(key);
    this.iv = parse(iv);
    this.md = md;
  }

  decrypt(cipherText: string) {
    return aesDecrypt(cipherText, this.key, this.getOptions).toString(UTF8);
  }

  encrypt(plainText: string) {
    return aesEncrypt(plainText, this.key, this.getOptions).toString();
  }
}
// Bean64转换
class Base64Encryption implements Encryption {
  private static instance: any;

  // private constructor() {}

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): Base64Encryption {
    if (!Base64Encryption.instance) {
      Base64Encryption.instance = new Base64Encryption();
    }
    return Base64Encryption.instance;
  }

  decrypt(cipherText: string) {
    return Base64.parse(cipherText).toString(UTF8);
  }

  encrypt(plainText: string) {
    return UTF8.parse(plainText).toString(Base64);
  }
}

// Define a singleton class for MD5 Hashing
class MD5Hashing implements Hashing {
  private static instance: any;

  // private constructor() {}

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): MD5Hashing {
    if (!MD5Hashing.instance) {
      MD5Hashing.instance = new MD5Hashing();
    }
    return MD5Hashing.instance;
  }

  hash(plainText: string) {
    return MD5(plainText).toString();
  }
}

// Define a singleton class for SHA256 Hashing
class SHA256Hashing implements Hashing {
  private static instance: any;

  // private constructor() {}

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): SHA256Hashing {
    if (!SHA256Hashing.instance) {
      SHA256Hashing.instance = new SHA256Hashing();
    }
    return SHA256Hashing.instance;
  }

  hash(plainText: string) {
    return SHA256(plainText).toString();
  }
}

// Define a singleton class for SHA512 Hashing
class SHA512Hashing implements Hashing {
  private static instance: any;

  // private constructor() {}

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): SHA256Hashing {
    if (!SHA512Hashing.instance) {
      SHA512Hashing.instance = new SHA512Hashing();
    }
    return SHA512Hashing.instance;
  }

  hash(plainText: string) {
    return SHA512(plainText).toString();
  }
}

export class EncryptionBean implements EncryptionFactory {
  createAesEncryption(params?: EncryptionParams): Encryption {
    return new AesEncryption({ ...params });
  }
  createBase64Encryption(): Encryption {
    return Base64Encryption.getInstance();
  }
}

export class HashingBean implements HashingFactory {
  createMD5Hashing(): Hashing {
    return MD5Hashing.getInstance();
  }
  createSHA256Hashing(): Hashing {
    return SHA256Hashing.getInstance();
  }
  createSHA512Hashing(): Hashing {
    return SHA512Hashing.getInstance();
  }
}
