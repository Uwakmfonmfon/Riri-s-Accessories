import './admin.css';
import { initToast } from './ui/toast.ts';
import { initPanels } from './ui/panels.ts';
import { doLogin, doSignOut, checkSession } from './ui/login.ts';
import { initImageUpload, handleImageSelect, clearImage as clearImageFn } from './ui/image-upload.ts';
import { initProductForm, saveProduct, resetForm } from './ui/product-form.ts';
import { initProductsTable } from './ui/products-table.ts';
import { showPanel } from './ui/panels.ts';

// Order: helpers first, then modules that own state.
initToast();
initPanels();
initImageUpload();
initProductForm();
initProductsTable();
void checkSession();

// Attach the small `__admin` surface that inline onclick handlers call into.
// This keeps form/sidebar markup declarative while the real logic lives in
// the modules above.
(window as unknown as { __admin: Record<string, unknown> }).__admin = {
  doLogin,
  doSignOut,
  saveProduct,
  showPanel,
  handleImageSelect,
  clearImage: clearImageFn,
  resetForm,
};
