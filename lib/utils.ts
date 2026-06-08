import dayjs from "dayjs";
export function formatCurrency(
  value: number | string | null | undefined,
  currency = "INR",
): string {
  try {
    if (value === null || value === undefined || value === "") {
      return "₹0.00";
    }

    const numericValue = typeof value === "string" ? Number(value) : value;
    if (Number.isNaN(numericValue)) {
      return "₹0.00";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
  } catch (error) {
    return "₹0.00";
  }
}
export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid()
    ? parsedDate.format("MM/DD/YYYY")
    : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};