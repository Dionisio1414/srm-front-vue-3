function getStorageItem(key) {
  const value = localStorage.getItem(key);

  if (value) return value;

  return 'light';
}

function connectStyles() {
  const scheme = getStorageItem('ui-color-scheme');

  const styles = `/theme-${scheme}.css`;

  const $link = document.getElementById('scheme');

  document.documentElement.dataset.theme = scheme;

  if ($link) $link.setAttribute('href', styles);
}

connectStyles();

document.addEventListener('change:ui-color-scheme', connectStyles);
