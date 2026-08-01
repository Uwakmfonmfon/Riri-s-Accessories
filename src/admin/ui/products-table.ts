import { on, dispatch, PRODUCTS_CHANGED_EVENT } from '../../lib/dom.ts';
import { supabase } from '../../lib/supabase.ts';
import { CAT_LABELS } from '../../lib/store-config.ts';
import type { Product } from '../../lib/types.ts';
import { showToast } from './toast.ts';
import { editProduct } from './product-form.ts';

let allProducts: Product[] = [];

export function initProductsTable(): void {
  const tbody = document.getElementById('productsTableBody');
  if (tbody) {
    on(tbody, 'click', {
      edit: (el) => {
        const id = Number(el.dataset.id);
        if (Number.isFinite(id)) editProduct(id);
      },
      delete: async (el) => {
        const id = Number(el.dataset.id);
        if (!Number.isFinite(id)) return;
        if (!confirm('Delete this product? This cannot be undone.')) return;
        el.classList.add('busy');
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
          showToast('Delete failed: ' + error.message);
          el.classList.remove('busy');
          return;
        }
        showToast('Product deleted');
        await loadProducts();
      },
    });
  }

  window.addEventListener(PRODUCTS_CHANGED_EVENT, () => {
    void loadProducts();
  });
}

export async function loadProducts(): Promise<void> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    showToast('Failed to load products');
    return;
  }

  allProducts = (data ?? []) as Product[];
  renderTable();
  updateStats();
}

function renderTable(): void {
  const tbody = document.getElementById('productsTableBody');
  const countEl = document.getElementById('sidebarCount');
  if (countEl) countEl.textContent = String(allProducts.length);

  if (!tbody) return;
  if (!allProducts.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-state-icon">✦</div><p>No products yet. Add your first one!</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = allProducts
    .map(
      (p) => `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:12px">
            <div class="thumb">
              ${
                p.image_url
                  ? `<img src="${escapeAttr(p.image_url)}" alt="${escapeAttr(p.name)}" onerror="this.parentElement.innerHTML='✦'">`
                  : '✦'
              }
            </div>
            <span class="product-name-cell">${escapeHtml(p.name)}</span>
          </div>
        </td>
        <td><span class="cat-badge cat-${p.category}">${CAT_LABELS[p.category] ?? p.category}</span></td>
        <td><strong>₦${Number(p.price).toLocaleString()}</strong></td>
        <td><span class="stock-badge ${p.in_stock ? 'in-stock' : 'out-stock'}">${p.in_stock ? 'In Stock' : 'Sold Out'}</span></td>
        <td>
          <div class="tbl-btns">
            <button class="tbl-btn edit-btn" data-action="edit" data-id="${p.id}">✏️ Edit</button>
            <button class="tbl-btn del-btn" data-action="delete" data-id="${p.id}">🗑️ Delete</button>
          </div>
        </td>
      </tr>
    `,
    )
    .join('');
}

function updateStats(): void {
  (['jewelry', 'bags', 'watches', 'other'] as const).forEach((cat) => {
    const el = document.getElementById(`s-${cat}`);
    if (el) el.textContent = String(allProducts.filter((p) => p.category === cat).length);
  });
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

// Allow external modules to reload after a save (e.g. product-form).
export function refresh(): void {
  dispatch(PRODUCTS_CHANGED_EVENT);
}
