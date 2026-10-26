export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const picture = row.querySelector('picture');
  if (picture) {
    const imageColumn = picture.closest('div');
    const image = picture.querySelector('img');
    const caption = imageColumn?.textContent.replace(picture.textContent, '').trim();
    if (image && !image.alt && caption) image.alt = caption;
    block.prepend(picture);
    if (imageColumn && imageColumn !== row) imageColumn.remove();
  }

  [...row.children].forEach((content) => block.append(content));
  row.remove();

  const content = [...block.children].find((child) => child.querySelector('h1, h2, h3'));
  if (content) {
    content.querySelectorAll('p a[href]').forEach((link, index) => {
      link.className = `button ${index === 0 ? 'primary' : 'secondary'}`;
      link.closest('p').classList.add('button-wrapper');
    });
  }
}
