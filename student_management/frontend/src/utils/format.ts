export const money = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const shortMoney = (n: number) => (n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : '₹' + n.toLocaleString('en-IN'))

export const today = () => new Date().toLocaleDateString('en-CA')

export const has = (search: string, ...values: (string | number | undefined)[]) =>
  values.some((v) => String(v ?? '').toLowerCase().includes(search.trim().toLowerCase()))