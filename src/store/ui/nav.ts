import { on } from '../../lib/dom.ts';

export function initNav(): void {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close the mobile menu when a nav link inside it is tapped.
  on(navLinks, 'click', {
    filter: () => {
      navLinks.classList.remove('open');
    },
  });
}
