// Brazilian number formatting, written by hand so the output never depends on the
// browser's ICU data: R$ 1.546,28 · 4,09% · 2.463. Negative values use U+2212 and the
// currency sign is followed by a no-break space (U+00A0), as STYLE.md requires.

export const NBSP = ' ';
export const MINUS = '−';

const groupThousands = (digits: string) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// 1546.28 -> "1.546,28" (no currency sign). Negative -> "−1.546,28".
export const formatDecimal = (value: number, decimals: number): string => {
  const negative = value < 0;
  const fixed = Math.abs(value).toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  const body = groupThousands(intPart) + (decimals > 0 ? `,${decPart}` : '');
  return (negative ? MINUS : '') + body;
};

// Money digits only, two decimals: 6449.1 -> "6.449,10".
export const formatMoneyDigits = (value: number) => formatDecimal(Math.abs(value), 2);

// Full money string for running text: "R$ 1.576,23"; negative "−R$ 190,00".
export const formatBRL = (value: number) =>
  (value < 0 ? MINUS : '') + `R$${NBSP}` + formatMoneyDigits(value);

export const formatInt = (value: number) => formatDecimal(Math.round(value), 0);

// 4.09 -> "4,09%".
export const formatPct = (value: number) => `${formatDecimal(value, 2)}%`;

// Percentage points with two decimals: 0.5 -> "0,50".
export const formatPoints = (value: number) => formatDecimal(value, 2);

// Thousands rounded to 0.1: 7876.05 -> "7,9" (the caller writes "mil").
export const formatThousandsOneDecimal = (value: number) => formatDecimal(Math.round(value / 100) / 10, 1);

// Seconds with two decimals and a no-break space before the unit: 0.07 -> "0,07 s".
export const formatSeconds = (value: number) => `${formatDecimal(value, 2)}${NBSP}s`;

// Parse a raw Brazilian decimal field from the source file: "6449,10" -> 6449.1.
export const parseRawDecimal = (field: string): number | null => {
  if (!/^-?\d+(,\d+)?$/.test(field)) return null;
  return Number(field.replace(',', '.'));
};
