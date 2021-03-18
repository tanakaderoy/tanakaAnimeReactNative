/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import base64 from 'base-64';

export default class Base64 {
  public static encode(data: string): string {
    return base64.encode(data);
  }

  public static decode(data: string): string {
    return base64.decode(data);
  }
}
