export function formatRupiah(value: string | number): string {
  const num = Number(value);
  if (isNaN(num)) return String(value);
  return num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
