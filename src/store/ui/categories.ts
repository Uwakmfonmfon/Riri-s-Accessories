import { on, dispatch, FILTER_EVENT } from '../../lib/dom.ts';
import type { Category } from '../../lib/types.ts';

export function initCategories(): void {
  // Category cards in the hero area.
  on(document, 'click', {
    filter: (el) => {
      const cat = el.dataset.cat;
      if (!cat) return;

      // Update the active state on the .cat-card grid.
      const card = el.closest<HTMLElement>('.cat-card');
      if (card) {
        document
          .querySelectorAll('.cat-card')
          .forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
      }

      // Also keep the .filter-btn bar in sync.
      document
        .querySelectorAll<HTMLElement>('.filter-btn')
        .forEach((b) => b.classList.toggle('active', b.dataset.cat === cat));

      dispatch(FILTER_EVENT, cat as Category);
    },
  });
}
