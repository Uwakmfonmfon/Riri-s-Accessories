import { dispatch, PRODUCTS_CHANGED_EVENT } from '../../lib/dom.ts';
import { supabase } from '../../lib/supabase.ts';
import type { ProductInput } from '../../lib/types.ts';
import { showToast } from './toast.ts';
import { showPanel } from './panels.ts';
import {
  clearImage,
  getCurrentImageUrl,
  setCurrentImageUrl,
  showPreview,
  setUploadStatus,
} from './image-upload.ts';

export function initProductForm(): void {
  // Form actions are dispatched from HTML onclick handlers via __admin.
}

export async function saveProduct(): Promise<void> {
  const nameEl = document.getElementById('pName') as HTMLInputElement | null;
  const priceEl = document.getElementById('pPrice') as HTMLInputElement | null;
  const catEl = document.getElementById('pCat') as HTMLSelectElement | null;
  const descEl = document.getElementById('pDesc') as HTMLTextAreaElement | null;
  const stockEl = document.getElementById('pInStock') as HTMLInputElement | null;
  const editingEl = document.getElementById('editingId') as HTMLInputElement | null;
  const status = document.getElementById('uploadStatus');
  const btn = document.getElementById('saveBtn') as HTMLButtonElement | null;

  const name = nameEl?.value.trim() ?? '';
  const price = parseFloat(priceEl?.value ?? '');
  const cat = catEl?.value ?? '';
  const desc = descEl?.value.trim() ?? '';
  const inStock = stockEl?.checked ?? true;
  // Single source of truth: read the id once.
  const editingId = editingEl?.value ? parseInt(editingEl.value, 10) : null;

  if (!name) return showFormError('Product name is required.');
  if (!Number.isFinite(price) || price <= 0)
    return showFormError('Enter a valid price.');
  if (!cat) return showFormError('Please select a category.');
  if (status?.classList.contains('uploading'))
    return showFormError('Please wait for the image to finish uploading.');

  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Saving...';
  }

  // ProductInput omits `id` and `created_at`, so the type system guarantees
  // an INSERT payload never carries an id.
  const payload: ProductInput = {
    name,
    price,
    category: cat as ProductInput['category'],
    description: desc || null,
    image_url: getCurrentImageUrl(),
    in_stock: inStock,
  };

  let dbError;
  if (editingId !== null) {
    const { error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', editingId);
    dbError = error;
  } else {
    const { error } = await supabase.from('products').insert(payload);
    dbError = error;
  }

  if (btn) {
    btn.disabled = false;
    btn.textContent = '💾 Save Product';
  }

  if (dbError) return showFormError(`Save failed: ${dbError.message}`);

  showToast(editingId !== null ? 'Product updated ✓' : 'Product added ✓');
  resetForm();
  dispatch(PRODUCTS_CHANGED_EVENT);
  showPanel('products');
}

export async function editProduct(id: number): Promise<void> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (!data) return;
  const p = data as {
    id: number;
    name: string;
    price: number;
    category: string;
    description: string | null;
    in_stock: boolean;
    image_url: string | null;
  };

  const titleEl = document.getElementById('formPanelTitle');
  if (titleEl) titleEl.textContent = 'Edit Product';
  const editingEl = document.getElementById('editingId') as HTMLInputElement | null;
  if (editingEl) editingEl.value = String(p.id);
  (document.getElementById('pName') as HTMLInputElement | null) &&
    ((document.getElementById('pName') as HTMLInputElement).value = p.name);
  (document.getElementById('pPrice') as HTMLInputElement | null) &&
    ((document.getElementById('pPrice') as HTMLInputElement).value = String(p.price));
  (document.getElementById('pCat') as HTMLSelectElement | null) &&
    ((document.getElementById('pCat') as HTMLSelectElement).value = p.category);
  (document.getElementById('pDesc') as HTMLTextAreaElement | null) &&
    ((document.getElementById('pDesc') as HTMLTextAreaElement).value = p.description ?? '');
  (document.getElementById('pInStock') as HTMLInputElement | null) &&
    ((document.getElementById('pInStock') as HTMLInputElement).checked = p.in_stock);

  if (p.image_url) {
    setCurrentImageUrl(p.image_url);
    showPreview(p.image_url);
    const clearBtn = document.getElementById('clearImgBtn') as HTMLElement | null;
    if (clearBtn) clearBtn.style.display = 'inline-block';
    setUploadStatus('✓ Existing image loaded', 'success');
  } else {
    clearImage();
  }

  showPanel('add');
}

export function resetForm(): void {
  const titleEl = document.getElementById('formPanelTitle');
  if (titleEl) titleEl.textContent = 'Add New Product';
  const editingEl = document.getElementById('editingId') as HTMLInputElement | null;
  if (editingEl) editingEl.value = '';
  (document.getElementById('pName') as HTMLInputElement | null) &&
    ((document.getElementById('pName') as HTMLInputElement).value = '');
  (document.getElementById('pPrice') as HTMLInputElement | null) &&
    ((document.getElementById('pPrice') as HTMLInputElement).value = '');
  (document.getElementById('pCat') as HTMLSelectElement | null) &&
    ((document.getElementById('pCat') as HTMLSelectElement).value = '');
  (document.getElementById('pDesc') as HTMLTextAreaElement | null) &&
    ((document.getElementById('pDesc') as HTMLTextAreaElement).value = '');
  (document.getElementById('pInStock') as HTMLInputElement | null) &&
    ((document.getElementById('pInStock') as HTMLInputElement).checked = true);
  const errEl = document.getElementById('formErrorMsg');
  if (errEl) errEl.style.display = 'none';
  clearImage();
}

function showFormError(msg: string): void {
  const el = document.getElementById('formErrorMsg');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}
