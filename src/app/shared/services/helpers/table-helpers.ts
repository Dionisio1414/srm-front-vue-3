function formatDate(value: string | Date, withTime = false): string {
  if (!value) return '';

  const date = new Date(value);
  const [yy, mm, dd, h, m, s] = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];

  const formatNumber = (x: number): number | string => (x < 10 ? `0${x}` : x);

  return `${yy}-${formatNumber(mm)}-${formatNumber(dd)}${
    withTime ? `, ${formatNumber(h)}:${formatNumber(m)}:${formatNumber(s)}` : ''
  }`;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('ru', {
    style: 'currency',
    currency: 'USD',
  });
}

function getTagClass(color: string): string {
  const [, theme] = color.split('-');

  return `p-button-${theme === 'dark' ? 'secondary' : theme}`;
}

export { formatDate, formatCurrency, getTagClass };
