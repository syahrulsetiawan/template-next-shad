export function formatRupiah(value: string | number): string {
  const num = Number(value);
  if (isNaN(num)) return String(value);
  return num.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Format date-fns ("YYYY-MM-DD")
// https://date-fns.org/v4.1.0/docs/format
export const FORMAT_DATE = 'yyyy-MM-dd';
