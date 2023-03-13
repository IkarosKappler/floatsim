/**
 * Wraps a Record<string,string> and adds type conversion methpds.
 *
 * @author  Ikars Kappler
 * @version 1.0.0
 * @date    2023-03-13
 */

export class Params {
  baseParams: Record<string, string>;

  constructor(baseParams: Record<string, string>) {
    this.baseParams = baseParams;
  }

  getString(name: string, fallback: string): string {
    let value = this.baseParams[name];
    if (typeof value === "undefined" || !value || (value = value.trim()).length === 0) {
      return fallback;
    }
    return value;
  }

  getNumber(name: string, fallback: number): number {
    let value = this.baseParams[name];
    if (typeof value === "undefined" || !value || (value = value.trim()).length === 0) {
      return fallback;
    }
    return Number(value);
  }

  getBoolean(name: string, fallback: boolean): boolean {
    let value = this.baseParams[name];
    if (typeof value === "undefined" || !value || (value = value.trim()).length === 0) {
      return fallback;
    }
    return Boolean(value);
  }
}
