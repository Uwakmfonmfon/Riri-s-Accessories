let toastEl: HTMLElement | null = null;

export function initToast(): void {
  toastEl = document.getElementById('toast');
}

export function showToast(msg: string): void {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  window.setTimeout(() => toastEl?.classList.remove('show'), 3000);
}
