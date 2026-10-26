export default function decorate(block) {
  [...block.children].forEach((item) => {
    item.classList.add('stats-item');
    item.children[0]?.classList.add('stats-value');
    item.children[1]?.classList.add('stats-label');
  });
}
