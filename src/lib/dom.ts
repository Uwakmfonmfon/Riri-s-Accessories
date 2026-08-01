type Handler = (el: HTMLElement) => void;
type ActionMap = Record<string, Handler>;

/**
 * One delegated click listener on `root` that dispatches to `map[action]`
 * when the click target (or any of its ancestors) carries `data-action="..."`.
 *
 * The handler receives the element with the `data-action` attribute, not the
 * original click target. Read `dataset` from that element to pick up
 * `data-id`, `data-cat`, `data-method`, etc.
 */
export function on(
  root: ParentNode,
  type: 'click',
  map: ActionMap,
): void {
  root.addEventListener(type, (event) => {
    const target = event.target as Element | null;
    const el = target?.closest<HTMLElement>('[data-action]');
    if (!el) return;
    const action = el.dataset.action;
    const handler = action && map[action];
    if (!handler) return;
    event.preventDefault();
    handler(el);
  });
}

/**
 * Broadcast a custom event on `window`. Used so modules can talk to each
 * other (e.g. nav → products) without direct imports.
 */
export function dispatch(name: string, detail?: unknown): void {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export const FILTER_EVENT = 'riri:filter';
export const PRODUCTS_CHANGED_EVENT = 'riri:products-changed';
