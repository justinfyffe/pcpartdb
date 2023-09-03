interface FormatPriceOptions {
  decimals?: number;
  currency?: string;
}

export function formatPrice(value: number, options?: FormatPriceOptions) {
  const decimals = options?.decimals ?? 0;
  const currency = options?.currency?.toUpperCase() ?? 'USD';

  const ret = value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (currency === 'USD') {
    return `$${ret}`;
  } else {
    return `${ret} ${currency}`;
  }
}
