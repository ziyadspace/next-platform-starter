export const currency = new Intl.NumberFormat("ar-SA", {
  style: "currency",
  currency: "SAR",
  maximumFractionDigits: 2,
});

export const formatCurrency = (value: number) => currency.format(value);
export const formatDate = (value: string) => new Intl.DateTimeFormat("ar-SA", {
  year: "numeric",
  month: "long",
  day: "numeric",
}).format(new Date(value));
