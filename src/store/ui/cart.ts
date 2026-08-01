import { on } from '../../lib/dom.ts';
import type { CartItem, Product } from '../../lib/types.ts';

const cart: CartItem[] = [];

export function initCart(): void {
  on(document, 'click', {
    'open-cart': () => openCart(),
    'close-cart': () => closeCart(),
    'open-checkout': (el) => {
      const method = el.dataset.method;
      if (method === 'whatsapp' || method === 'bank' || method === 'opay') {
        window.dispatchEvent(
          new CustomEvent('riri:checkout', { detail: method }),
        );
      }
    },
  });

  const items = document.getElementById('cartItems');
  if (items) {
    on(items, 'click', {
      inc: (el) => changeQty(Number(el.dataset.id), 1),
      dec: (el) => changeQty(Number(el.dataset.id), -1),
      remove: (el) => removeFromCart(Number(el.dataset.id)),
    });
  }

  updateCartUI();
}

export function addToCart(product: Product): void {
  const existing = cart.find((i) => i.id === product.id);
  if (existing) existing.qty += 1;
  else
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      qty: 1,
    });
  updateCartUI();
  openCart();
}

function changeQty(id: number, delta: number): void {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    const idx = cart.indexOf(item);
    cart.splice(idx, 1);
  }
  updateCartUI();
}

function removeFromCart(id: number): void {
  const idx = cart.findIndex((i) => i.id === id);
  if (idx >= 0) cart.splice(idx, 1);
  updateCartUI();
}

function getTotal(): number {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function updateCartUI(): void {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const total = getTotal();

  const countEl = document.getElementById('bagCount');
  if (countEl) {
    countEl.textContent = String(count);
    countEl.classList.toggle('show', count > 0);
  }

  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = `₦${total.toLocaleString()}`;

  const footer = document.getElementById('cartFooter');
  if (footer) footer.style.display = cart.length ? 'block' : 'none';

  const itemsEl = document.getElementById('cartItems');
  if (!itemsEl) return;

  if (!cart.length) {
    itemsEl.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">✦</div><p>Your bag is empty</p></div>`;
    return;
  }

  itemsEl.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <div class="cart-item-thumb">
          ${
            item.image_url
              ? `<img src="${escapeAttr(item.image_url)}" alt="${escapeAttr(item.name)}" onerror="this.parentElement.innerHTML='✦'">`
              : '✦'
          }
        </div>
        <div class="cart-item-info">
          <p class="cart-item-name">${escapeHtml(item.name)}</p>
          <p class="cart-item-price">₦${Number(item.price).toLocaleString()} each</p>
          <div class="cart-item-controls">
            <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
            <button class="remove-btn" data-action="remove" data-id="${item.id}">✕ Remove</button>
          </div>
        </div>
      </div>
    `,
    )
    .join('');
}

function openCart(): void {
  document.getElementById('cartOverlay')?.classList.add('open');
  document.getElementById('cartDrawer')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart(): void {
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.body.style.overflow = '';
}

// Used by checkout.ts to read the cart contents without breaking encapsulation.
export function getCart(): readonly CartItem[] {
  return cart;
}

export function clearCart(): void {
  cart.length = 0;
  updateCartUI();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(value: string): string {
  return escapeHtml(value);
}
