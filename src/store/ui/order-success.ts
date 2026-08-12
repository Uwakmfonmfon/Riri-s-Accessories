import { STORE } from '../../lib/store-config.ts';
import type { CheckoutMethod } from '../../lib/types.ts';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface PersistedOrder {
  name: string;
  phone: string;
  address: string;
  method: CheckoutMethod;
  items: OrderItem[];
  total: number;
  ts: number;
}

const STORAGE_KEY = 'riri:lastOrder';

let toastEl: HTMLElement | null = null;

function showToast(msg: string): void {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  window.setTimeout(() => toastEl?.classList.remove('show'), 3200);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatNaira(value: number): string {
  return `₦${value.toLocaleString()}`;
}

function buildWhatsappMessage(order: PersistedOrder): string {
  const lines = order.items
    .map((i) => `• ${i.name} x${i.qty} — ${formatNaira(i.price * i.qty)}`)
    .join('\n');
  const paymentLabels: Partial<Record<CheckoutMethod, string>> = {
    bank: 'Bank Transfer',
    opay: 'Opay',
  };
  const paymentLabel = paymentLabels[order.method];
  let msg = `Hello Riri's Accessories! 💎\n\nNew Order from ${order.name}\nPhone: ${order.phone}\nAddress: ${order.address}\n\nItems:\n${lines}\n\nTotal: ${formatNaira(order.total)}`;
  if (paymentLabel) msg += `\n\nPayment Method: ${paymentLabel}`;
  msg += `\n\nPlease confirm my order. Thank you!`;
  return msg;
}

function paymentBlock(order: PersistedOrder): string {
  if (order.method === 'opay') {
    return `
      <div class="info-box">
        <div class="info-row">
          <span>Opay Number</span>
          <span class="info-value">
            <span>${STORE.opayNumber}</span>
            <button class="copy-btn" data-action="copy" data-copy="${STORE.opayNumber}">Copy</button>
          </span>
        </div>
        <div class="info-row">
          <span>Account Name</span>
          <span>${escapeHtml(STORE.accountName)}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-row">
          <span>Amount</span>
          <span class="info-total">${formatNaira(order.total)}</span>
        </div>
      </div>
      <p class="payment-hint">Send the total amount to the Opay number above, then reply to our WhatsApp with a screenshot of your transfer.</p>
    `;
  }
  if (order.method === 'bank') {
    return `
      <div class="info-box">
        <div class="info-row">
          <span>Bank</span>
          <span>${escapeHtml(STORE.bankName)}</span>
        </div>
        <div class="info-row">
          <span>Account Name</span>
          <span>${escapeHtml(STORE.accountName)}</span>
        </div>
        <div class="info-row">
          <span>Account No.</span>
          <span class="info-value">
            <span>${STORE.accountNumber}</span>
            <button class="copy-btn" data-action="copy" data-copy="${STORE.accountNumber}">Copy</button>
          </span>
        </div>
        <div class="info-divider"></div>
        <div class="info-row">
          <span>Amount</span>
          <span class="info-total">${formatNaira(order.total)}</span>
        </div>
      </div>
      <p class="payment-hint">Make a transfer of the total amount to the account above, then send your receipt on WhatsApp to confirm.</p>
    `;
  }
  // WhatsApp method — no payment info needed yet.
  return `
    <div class="info-box">
      <div class="info-row">
        <span>Status</span>
        <span>Awaiting confirmation</span>
      </div>
    </div>
    <p class="payment-hint">We've opened WhatsApp so you can send your order. We'll reply with payment details and confirm dispatch.</p>
  `;
}

function emptyState(): void {
  const titleEl = document.getElementById('successTitle');
  const subEl = document.getElementById('successSub');
  const summaryEl = document.getElementById('orderSummary');
  const paymentEl = document.getElementById('paymentInfo');
  if (titleEl) titleEl.textContent = 'No recent order found';
  if (subEl) subEl.textContent = 'Looks like you got here directly. Browse the shop and place an order to see your confirmation here.';
  if (summaryEl) summaryEl.innerHTML = '';
  if (paymentEl) paymentEl.innerHTML = '';
  const whatsapp = document.getElementById('whatsappFallback') as HTMLAnchorElement | null;
  if (whatsapp) whatsapp.style.display = 'none';
  const ornament = document.querySelector<HTMLElement>('.success-ornament');
  if (ornament) ornament.style.display = 'none';
}

function renderOrder(order: PersistedOrder): void {
  const titleEl = document.getElementById('successTitle');
  if (titleEl) titleEl.textContent = `Thank you, ${escapeHtml(order.name)}!`;

  const subtitles: Record<CheckoutMethod, string> = {
    whatsapp: "Your order is on its way to us on WhatsApp. We'll reply shortly.",
    bank: 'Your order is confirmed. Please make the bank transfer below to complete it.',
    opay: 'Your order is confirmed. Please send the Opay payment below to complete it.',
  };
  const subEl = document.getElementById('successSub');
  if (subEl) subEl.textContent = subtitles[order.method];

  const summaryEl = document.getElementById('orderSummary');
  if (summaryEl) {
    const itemsHtml = order.items
      .map(
        (i) => `
        <div class="summary-row">
          <span class="summary-name">${escapeHtml(i.name)} <span class="summary-qty">×${i.qty}</span></span>
          <span class="summary-price">${formatNaira(i.price * i.qty)}</span>
        </div>
      `,
      )
      .join('');
    summaryEl.innerHTML = `
      <h2 class="success-block-title">Your Order</h2>
      ${itemsHtml}
      <div class="summary-row summary-total">
        <span>Total</span>
        <span>${formatNaira(order.total)}</span>
      </div>
    `;
  }

  const paymentEl = document.getElementById('paymentInfo');
  if (paymentEl) {
    const titles: Record<CheckoutMethod, string> = {
      whatsapp: 'What happens next',
      bank: 'Bank Transfer Details',
      opay: 'Opay Payment Details',
    };
    paymentEl.innerHTML = `
      <h2 class="success-block-title">${titles[order.method]}</h2>
      ${paymentBlock(order)}
    `;
  }

  const whatsapp = document.getElementById('whatsappFallback') as HTMLAnchorElement | null;
  if (whatsapp) {
    const msg = buildWhatsappMessage(order);
    whatsapp.href = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(msg)}`;
  }
}

function loadOrder(): PersistedOrder | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedOrder;
  } catch {
    return null;
  }
}

function bindCopyActions(): void {
  document.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement | null;
    if (target?.dataset.action !== 'copy') return;
    const value = target.dataset.copy;
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      showToast('Copied!');
    } catch {
      // Fallback for browsers without clipboard API in non-secure contexts.
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showToast('Copied!');
      } catch {
        showToast('Copy failed — please copy manually.');
      }
      document.body.removeChild(ta);
    }
  });
}

function init(): void {
  toastEl = document.getElementById('toast');
  bindCopyActions();
  const order = loadOrder();
  if (!order) {
    emptyState();
    return;
  }
  renderOrder(order);
}

init();
