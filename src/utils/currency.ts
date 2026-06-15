export const formatCurrency = (
  amount: number,
  currency: string,
  locale: string = "en-US"
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

export const formatCurrencySymbol = (
  amount: number,
  symbol: string
): string => {
  return `${symbol}${amount.toFixed(2)}`;
};

export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: "$",
    GBP: "£",
    EUR: "€",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
  };
  return symbols[currency] || currency;
};
