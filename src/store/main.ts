import './style.css';
import { initNav } from './ui/nav.ts';
import { initCategories } from './ui/categories.ts';
import { initToast } from './ui/toast.ts';
import { initCart } from './ui/cart.ts';
import { initCheckout } from './ui/checkout.ts';
import { initProducts } from './ui/products.ts';

// Order matters: UI helpers wire up before products try to render.
initToast();
initNav();
initCategories();
initCart();
initCheckout();
await initProducts();
