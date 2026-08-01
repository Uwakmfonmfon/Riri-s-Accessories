import { supabase } from '../../lib/supabase.ts';
import { showToast } from './toast.ts';
import { loadProducts } from './products-table.ts';

export function initLogin(): void {
  // Form actions are wired by the HTML onclick handlers, which call into the
  // `__admin` surface attached in main.ts (doLogin / doSignOut).
  void checkSession();
}

export async function doLogin(): Promise<void> {
  const emailEl = document.getElementById('loginEmail') as HTMLInputElement | null;
  const passEl = document.getElementById('loginPass') as HTMLInputElement | null;
  const errEl = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn') as HTMLButtonElement | null;

  const email = emailEl?.value.trim() ?? '';
  const pass = passEl?.value ?? '';

  if (errEl) errEl.style.display = 'none';
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Signing in...';
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password: pass });

  if (btn) {
    btn.disabled = false;
    btn.textContent = 'Sign In →';
  }

  if (error) {
    if (errEl) {
      errEl.textContent = 'Incorrect email or password.';
      errEl.style.display = 'block';
    }
    return;
  }

  enterAdmin(email);
}

export async function doSignOut(): Promise<void> {
  await supabase.auth.signOut();
  const panel = document.getElementById('adminPanel');
  const login = document.getElementById('loginScreen');
  if (panel) panel.style.display = 'none';
  if (login) login.style.display = 'flex';
  const emailEl = document.getElementById('loginEmail') as HTMLInputElement | null;
  const passEl = document.getElementById('loginPass') as HTMLInputElement | null;
  if (emailEl) emailEl.value = '';
  if (passEl) passEl.value = '';
}

export async function checkSession(): Promise<void> {
  const { data } = await supabase.auth.getSession();
  if (data.session?.user?.email) {
    enterAdmin(data.session.user.email);
  }
}

function enterAdmin(email: string): void {
  const panel = document.getElementById('adminPanel');
  const login = document.getElementById('loginScreen');
  if (login) login.style.display = 'none';
  if (panel) panel.style.display = 'flex';
  const headerEmail = document.getElementById('headerEmail');
  if (headerEmail) headerEmail.textContent = email;
  void loadProducts();
  showToast('Signed in');
}
