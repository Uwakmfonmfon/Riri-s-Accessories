import { on } from '../../lib/dom.ts';
import { resetForm } from './product-form.ts';

export function initPanels(): void {
  on(document, 'click', {
    'show-panel': (el) => {
      const name = el.dataset.panel;
      if (name) showPanel(name);
    },
  });
}

export function showPanel(name: string): void {
  document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
  document.getElementById('panel-' + name)?.classList.add('active');
  document
    .querySelectorAll('.sidebar-nav li')
    .forEach((li) => li.classList.remove('active'));
  document.getElementById('nav-' + name)?.classList.add('active');
  if (name !== 'add') resetForm();
}
