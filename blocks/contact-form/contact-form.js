const allowedTypes = new Set(['text', 'email', 'tel', 'url', 'number']);

function readCell(row, index) {
  return row.children[index]?.textContent.trim() || '';
}

export default function decorate(block) {
  const rows = [...block.children];
  const form = document.createElement('form');
  form.className = 'contact-form-form';

  let submitLabel = 'Send Message';
  rows.forEach((row, index) => {
    const label = readCell(row, 0);
    if (!label) return;
    if (label.toLowerCase() === 'submit label') {
      submitLabel = readCell(row, 1) || submitLabel;
      return;
    }

    const fieldType = readCell(row, 1).toLowerCase();
    const placeholder = readCell(row, 2);
    const required = readCell(row, 3).toLowerCase() === 'required';
    const field = document.createElement('div');
    field.className = 'contact-form-field';

    const inputLabel = document.createElement('label');
    const fieldId = `contact-form-field-${index}`;
    inputLabel.htmlFor = fieldId;
    inputLabel.textContent = label;

    const input = fieldType === 'textarea'
      ? document.createElement('textarea')
      : document.createElement('input');
    input.id = fieldId;
    input.name = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (input instanceof HTMLInputElement) {
      input.type = allowedTypes.has(fieldType) ? fieldType : 'text';
    } else {
      input.rows = 5;
    }
    input.placeholder = placeholder;
    input.required = required;

    field.append(inputLabel, input);
    form.append(field);
  });

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'button primary';
  submit.textContent = submitLabel;
  form.append(submit);

  const status = document.createElement('p');
  status.className = 'contact-form-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  form.append(status);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = 'This form is not connected to a submission service yet.';
  });

  block.replaceChildren(form);

  const columns = block.closest('main')?.querySelector('.columns');
  const messageColumn = columns?.querySelector(':scope > div > div:nth-child(2)');
  if (messageColumn) {
    columns.classList.add('contact-form-columns');
    const fieldLabels = new Set(['Full Name', 'Email Address', 'Subject', 'Message', submitLabel]);
    messageColumn.querySelectorAll(':scope > p').forEach((paragraph) => {
      if (fieldLabels.has(paragraph.textContent.trim())) paragraph.remove();
    });
    const emptyWrapper = block.parentElement;
    messageColumn.append(block);
    if (emptyWrapper && emptyWrapper !== messageColumn && emptyWrapper.children.length === 0) {
      emptyWrapper.remove();
    }
  }
}
