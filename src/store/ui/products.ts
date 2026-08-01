import { supabase } from '../../lib/supabase.ts';
import { CAT_LABELS } from '../../lib/store-config.ts';
import { on, dispatch, FILTER_EVENT } from '../../lib/dom.ts';
import type { Category, Product } from '../../lib/types.ts';
import { addToCart } from './cart.ts';
import { showToast } from './toast.ts';

let allProducts: Product[] = [];
let currentFilter: Category | 'all' = 'all';

export async function initProducts(): Promise<void> {
  await loadProducts();

  // "Add to cart" buttons are rendered inside #productsGrid.
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  on(grid, 'click', {
    'add-to-cart': (el) => {
      const id = Number(el.dataset.id);
      if (!Number.isFinite(id)) return;
      const product = allProducts.find((p) => p.id === id);
      if (!product) return;
      addToCart(product);
      showToast(`"${product.name}" added to bag ✦`);
    },
  });

  // Footer / nav filter links re-use the same dispatch path.
  on(document, 'click', {
    filter: (el) => {
      const cat = el.dataset.cat;
      if (!cat) return;
      document
        .querySelectorAll<HTMLElement>('.filter-btn')
        .forEach((b) => b.classList.toggle('active', b.dataset.cat === cat));
      dispatch(FILTER_EVENT, cat as Category);
    },
  });

  // React to filter requests from anywhere.
  window.addEventListener(FILTER_EVENT, (e) => {
    const cat = (e as CustomEvent<Category | 'all'>).detail;
    renderProducts(cat);
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  });
}

async function loadProducts(): Promise<void> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  if (error) {
    grid.innerHTML =
      '<p class="no-products">Could not load products. Please try again later.</p>';
    return;
  }

  allProducts = (data ?? []) as Product[];
  renderProducts(currentFilter);
}

function renderProducts(filter: Category | 'all'): void {
  currentFilter = filter;
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const filtered =
    filter === 'all'
      ? allProducts
      : allProducts.filter((p) => p.category === filter);

  if (!filtered.length) {
    grid.innerHTML = '<p class="no-products">No products in this category yet.</p>';
    return;
  }

  grid.innerHTML = filtered
    .map(
      (p) => `
      <div class="product-card">
        <div class="product-img">
          ${
            p.image_url
              ? `<img src="${escapeAttr(p.image_url)}" alt="${escapeAttr(p.name)}" loading="lazy" onerror="this.parentElement.innerHTML='✦'">`
              : '✦'
          }
        </div>
        ${!p.in_stock ? '<div class="out-of-stock-badge">Sold Out</div>' : ''}
        <div class="product-info">
          <p class="product-cat">${CAT_LABELS[p.category] ?? p.category}</p>
          <h3 class="product-name">${escapeHtml(p.name)}</h3>
          ${p.description ? `<p class="product-desc">${escapeHtml(p.description)}</p>` : ''}
          <div class="product-footer">
            <span class="product-price">₦${Number(p.price).toLocaleString()}</span>
            <button
              class="add-btn"
              data-action="add-to-cart"
              data-id="${p.id}"
              ${!p.in_stock ? 'disabled' : ''}
            >Add</button>
          </div>
        </div>
      </div>
    `,
    )
    .join('');
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
