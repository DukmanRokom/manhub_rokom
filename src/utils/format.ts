/**
 * Formats a numeric value into Indonesian Rupiah (IDR) currency string.
 * This function assumes the input value is already in the final unit (not in millions).
 * 
 * @param value The numeric value to format
 * @returns Formatted currency string (e.g., "Rp 50.000.000")
 */
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value).replace('IDR', 'Rp').trim();
};
