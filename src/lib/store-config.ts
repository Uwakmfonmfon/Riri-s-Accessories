// Storefront constants. The values for WhatsApp number, account number, and
// Opay number are placeholders — replace with the real values when the store
// is live.
export const STORE = {
  whatsapp: '2348000000000', // TODO: replace with real WhatsApp number
  bankName: 'First Bank Nigeria',
  accountName: "Riri's Accessories",
  accountNumber: '3XXXXXXXXX', // TODO: replace
  opayNumber: '080XXXXXXXXX', // TODO: replace
} as const;

export const CAT_LABELS: Record<string, string> = {
  jewelry: 'Jewelry',
  bags: 'Bags',
  watches: 'Watches',
  other: 'Other',
};
