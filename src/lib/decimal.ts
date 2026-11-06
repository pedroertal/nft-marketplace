import BigNumber from 'bignumber.js';

// Configuração para garantir precisão e evitar notação exponencial indesejada
BigNumber.config({
  DECIMAL_PLACES: 18,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
  EXPONENTIAL_AT: [-18, 20],
});

export const Decimal = {
  add(a: string | number, b: string | number): string {
    return new BigNumber(a || 0).plus(new BigNumber(b || 0)).toFixed();
  },

  sub(a: string | number, b: string | number): string {
    return new BigNumber(a || 0).minus(new BigNumber(b || 0)).toFixed();
  },

  mul(a: string | number, b: string | number): string {
    return new BigNumber(a || 0).multipliedBy(new BigNumber(b || 0)).toFixed();
  },

  div(a: string | number, b: string | number): string {
    const divisor = new BigNumber(b || 1);
    if (divisor.isZero()) return '0';
    return new BigNumber(a || 0).dividedBy(divisor).toFixed();
  },

  compare(a: string | number, b: string | number): number {
    return new BigNumber(a || 0).comparedTo(new BigNumber(b || 0)) ?? 0;
  },

  isGreaterThan(a: string | number, b: string | number): boolean {
    return new BigNumber(a || 0).isGreaterThan(new BigNumber(b || 0));
  },

  isLessThan(a: string | number, b: string | number): boolean {
    return new BigNumber(a || 0).isLessThan(new BigNumber(b || 0));
  },

  isEqualTo(a: string | number, b: string | number): boolean {
    return new BigNumber(a || 0).isEqualTo(new BigNumber(b || 0));
  },

  toEthString(val: string | number, decimals: number = 4): string {
    try {
      const bn = new BigNumber(val || 0);
      return bn.toFixed(decimals);
    } catch {
      return '0.0000';
    }
  },
};
