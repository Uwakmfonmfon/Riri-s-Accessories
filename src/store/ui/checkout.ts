import { on } from '../../lib/dom.ts';
import { STORE } from '../../lib/store-config.ts';
import { clearCart, getCart } from './cart.ts';
import { showToast } from './toast.ts';
import type { CheckoutMethod } from '../../lib/types.ts';

let activeMethod: CheckoutMethod | null = null;

export function initCheckout(): void {
  window.addEventListener('riri:checkout', (e) => {
    openCheckout((e as CustomEvent<CheckoutMethod>).detail);
  });

  on(document, 'click', {
    'close-modal': () => closeModal(),
  });

  document.getElementById('checkoutModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
}

function openCheckout(method: CheckoutMethod): void {
  const cart = getCart();
  if (!cart.length) {
    showToast('Add items to your bag first!');
    return;
  }
  activeMethod = method;
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const titles: Record<CheckoutMethod, string> = {
    whatsapp: '💬 Order via WhatsApp',
    bank: '🏦 Bank Transfer',
    opay: '🟠 Pay with Opay',
  };
  const subs: Record<CheckoutMethod, string> = {
    whatsapp: "Confirm your details — we'll open WhatsApp for you.",
    bank: 'Transfer to the account below, then send your receipt.',
    opay: 'Send payment to our Opay number, then confirm here.',
  };

  const titleEl = document.getElementById('modalTitle');
  const subEl = document.getElementById('modalSub');
  if (titleEl) titleEl.textContent = titles[method];
  if (subEl) subEl.textContent = subs[method];

  const btnLabels: Record<CheckoutMethod, string> = {
    whatsapp: 'Open WhatsApp →',
    bank: 'Send Receipt on WhatsApp →',
    opay: 'Confirm Opay Order →',
  };

  let infoBox = '';
  if (method === 'bank') {
    infoBox = `
      <div class="info-box">
        <div class="info-row"><span>Bank</span><span>${STORE.bankName}</span></div>
        <div class="info-row"><span>Account Name</span><span>${STORE.accountName}</span></div>
        <div class="info-row"><span>Account No.</span><span>${STORE.accountNumber}</span></div>
        <div class="info-divider"></div>
        <div class="info-row"><span>Amount</span><span class="info-total">₦${total.toLocaleString()}</span></div>
      </div>`;
  } else if (method === 'opay') {
    infoBox = `
      <div class="info-box">
        <div class="info-row"><span>Opay Number</span><span>${STORE.opayNumber}</span></div>
        <div class="info-row"><span>Name</span><span>${STORE.accountName}</span></div>
        <div class="info-divider"></div>
        <div class="info-row"><span>Amount</span><span class="info-total">₦${total.toLocaleString()}</span></div>
      </div>`;
  }

  const body = document.getElementById('modalBody');
  if (body) {
    body.innerHTML = `
      ${infoBox}
      <div class="form-group"><label>Your Name</label><input type="text" id="coName" placeholder="e.g. Amara Johnson"></div>
      <div class="form-group"><label>Phone Number</label><input type="tel" id="coPhone" placeholder="080XXXXXXXX"></div>
      <div class="form-group"><label>Delivery Address</label><textarea id="coAddress" placeholder="Full delivery address"></textarea></div>
      <p class="form-error" id="formError">Please fill in all fields.</p>
      <button class="modal-submit ${method}" data-action="submit-order">${btnLabels[method]}</button>
    `;
  }

  document.getElementById('checkoutModal')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.getElementById('cartDrawer')?.classList.remove('open');
}

function closeModal(): void {
  document.getElementById('checkoutModal')?.classList.remove('open');
}

// Wire the dynamic "submit" button — needs to be set after the modal body
// is rendered. We use a delegated listener on the body so the click works
// regardless of when the innerHTML was rewritten.
function submitOrder(): void {
  const name = (document.getElementById('coName') as HTMLInputElement | null)?.value.trim() ?? '';
  const phone = (document.getElementById('coPhone') as HTMLInputElement | null)?.value.trim() ?? '';
  const address = (document.getElementById('coAddress') as HTMLTextAreaElement | null)?.value.trim() ?? '';
  const errEl = document.getElementById('formError');

  if (!name || !phone || !address) {
    if (errEl) errEl.style.display = 'block';
    return;
  }
  if (errEl) errEl.style.display = 'none';

  const paymentLabels: Partial<Record<CheckoutMethod, string>> = {
    bank: 'Bank Transfer',
    opay: 'Opay',
  };

  const cart = getCart();
  const lines = cart
    .map((i) => `• ${i.name} x${i.qty} — ₦${(i.price * i.qty).toLocaleString()}`)
    .join('\n');
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  let msg = `Hello Riri's Accessories! 💎\n\nNew Order from ${name}\nPhone: ${phone}\nAddress: ${address}\n\nItems:\n${lines}\n\nTotal: ₦${total.toLocaleString()}`;
  const paymentLabel = activeMethod ? paymentLabels[activeMethod] : undefined;
  if (paymentLabel) msg += `\n\nPayment Method: ${paymentLabel}`;
  msg += `\n\nPlease confirm my order. Thank you!`;

  const url = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');

  clearCart();
  closeModal();
  showToast("Order sent! We'll confirm shortly ✦");
}

// Re-bind the submit listener once. We hook it on `document` so the
// dynamically-rendered button inside #modalBody still triggers it.
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement | null;
  if (target?.dataset.action === 'submit-order') {
    submitOrder();
  }
});
