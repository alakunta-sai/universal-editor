import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function decorateAuthoredLinks(footer) {
  footer.querySelectorAll('.columns p').forEach((paragraph) => {
    const text = paragraph.textContent.trim();
    const pathMatch = text.match(/^(.+?)\s+[\u2014\u2013-]\s+(\/\S*)$/);
    const emailMatch = text.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    let label = text;
    let href = '';
    if (pathMatch) {
      const [, pathLabel, pathHref] = pathMatch;
      label = pathLabel.trim();
      href = pathHref;
    } else if (emailMatch) {
      href = `mailto:${text}`;
    }
    if (!href) return;

    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    paragraph.replaceChildren(link);
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) throw new Error(`Footer fragment could not be loaded: ${footerPath}`);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  decorateAuthoredLinks(footer);

  block.append(footer);
}
