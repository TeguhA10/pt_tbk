export const formatRupiah = (val: number | string | null | undefined): string => {
  if (val === null || val === undefined || isNaN(Number(val))) return 'Rp 0'
  const num = Number(val)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(num)
}
