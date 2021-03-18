import CryptoES from 'crypto-es';
import Base64 from './Base64';

const KEY_LENGTH = 64;
const KEY_SPLIT = KEY_LENGTH / 2;
const KEY_SPLIT_CHAR = ':';

/**
 * Set of helper methods to obfuscate strings such as 3rd party app IDs, tokens, etc.<br>
 */
export default class ObfuscationUtil {
  private constructor() {}

  /**
   * Given the input and key strings, returns an obfuscated list of strings that can be used to
   * retrieve the original data at a later point. The key should be 64 random characters. Generation
   * tools can be found online: e.g.
   * <a href="https://www.grc.com/passwords.htm">https://www.grc.com/passwords.htm</a>
   *
   * @param data data to be obfuscated and encrypted
   * @param key  the string to use as a password for encryption
   * @return An array of strings used to obfuscate the encrypted data and key
   * @see <a href="https://www.grc.com/passwords.htm">https://www.grc.com/passwords.htm</a>
   */
  public static getObfuscatedStrings(data: string, key: string): string[] {
    const obfuscated = ObfuscationUtil.obfuscate(key, data);

    const originalLength = data.length;
    const obfuscatedLength = obfuscated.length;

    const arraySize = Math.ceil(obfuscatedLength / originalLength);
    const strings: string[] = new Array<string>();

    let start, end;
    let substring: string;

    for (let i = 0; i < arraySize; i++) {
      start = i * originalLength;
      end = Math.min(start + originalLength, obfuscatedLength);
      substring = obfuscated.substring(start, end);
      strings.push(substring);
    }

    return strings;
  }

  /**
   * @param strings an array of strings originally obtained from {@link #getObfuscatedStrings(String, String)}
   * @return An un-obfuscated string
   */
  public static getUnobfuscatedString(strings: string[]): string {
    return ObfuscationUtil.unobfuscate(strings.join(''));
  }

  /**
   * Encrypts data with the given key, and creates an obfuscated string suitable for data
   * retrieval later on.
   *
   * @param data data to be obfuscated and encrypted
   * @param key  the string to use as a password for encryption
   * @return an obfuscated string
   */
  private static obfuscate(key: string, data: string): string {
    const encryptedData = ObfuscationUtil.encryptData(key, data);
    const first = key.substring(0, KEY_SPLIT);
    const last = key.substring(key.length - KEY_SPLIT);
    const encodedFirst = Base64.encode(first);
    const encodedLast = Base64.encode(last);
    const keySplitSize = encodedFirst.length;

    return `${keySplitSize}${KEY_SPLIT_CHAR}${encodedFirst}${encryptedData}${encodedLast}`;
  }

  /**
   * Encrypts the given data, using the given key. Does not perform obfuscation.
   *
   * @param data data to be encrypted
   * @param key  the string to use as a password for encryption
   * @return encrypted version of the given data, using the given key
   */
  private static encryptData(key: string, data: string): string {
    return CryptoES.AES.encrypt(data, key).toString();
  }

  /**
   * Takes an obfuscated string generated previously by {@link #obfuscate(String, String)}
   * and unobfuscates and decrypts it.
   *
   * @param obfuscated currently obfuscated and encrypted string
   * @return an unobfuscated and decrypted string
   */
  private static unobfuscate(obfuscated: string): string {
    const pairKeyData = ObfuscationUtil.getKeyAndData(obfuscated);
    const decryptedData = ObfuscationUtil.decryptData(
      pairKeyData[0],
      pairKeyData[1],
    );
    return decryptedData;
  }

  /**
   * Given the obfuscated string param, splits it into the key and data parts of it.
   *
   * @param obfuscated obfuscated string containing data and key parts
   * @return the key (first) and data (second) parts of the given obfuscated string
   */
  private static getKeyAndData(obfuscated: string): [string, string] {
    const keySplitSize = ObfuscationUtil.getKeySplitSize(obfuscated);
    const obfuscatedData = ObfuscationUtil.getObfuscatedData(obfuscated);

    // key will be first and last [value of keySplitSize] N characters
    const first = obfuscatedData.substring(0, keySplitSize);
    const last = obfuscatedData.substring(obfuscatedData.length - keySplitSize);

    const key = Base64.decode(first) + Base64.decode(last);

    // data will be between the first and last [value of keySplitSize] N characters
    const data = obfuscatedData.substring(
      keySplitSize,
      obfuscatedData.length - keySplitSize,
    );
    return [key, data];
  }

  /**
   * Uses the provided key to decrypt the given data.
   *
   * @param key           the string to use as a password for decryption
   * @param encryptedData the string to be decrypted
   * @return decrypted data
   */
  private static decryptData(key: string, encryptedData: string): string {
    return CryptoES.AES.decrypt(encryptedData, key).toString(CryptoES.enc.Utf8);
  }

  /**
   * Searches the obfuscated string for the key size value encoded in it.
   *
   * @param obfuscated the obfuscated string to search
   * @return the key size
   */
  private static getKeySplitSize(obfuscated: string): number {
    const sizeIndex = obfuscated.indexOf(KEY_SPLIT_CHAR);
    const keySize = obfuscated.substring(0, sizeIndex);
    return Number(keySize);
  }

  /**
   * Given the obfuscated string containing key split size, key, and data parts - returns
   * the portion with just the key and data parts.
   *
   * @param obfuscated the obfuscated string containing key split size, key, and data parts
   * @return the portion of the obfuscated string with just the key and data parts
   */
  private static getObfuscatedData(obfuscated: string): string {
    const sizeIndex = obfuscated.indexOf(KEY_SPLIT_CHAR);
    return obfuscated.substring(sizeIndex + 1);
  }
}
