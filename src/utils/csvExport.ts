import type Sale from '../models/Sale';

const CSV_HEADER = '日時,カタログ名,商品名,単価,数量,小計';

const FORMULA_PREFIXES = ['=', '+', '-', '@', '\t', '\r'];

export const escapeCsvField = (field: string): string => {
  let sanitized = field;
  if (sanitized.length > 0 && FORMULA_PREFIXES.includes(sanitized[0])) {
    sanitized = `'${sanitized}`;
  }
  if (sanitized.includes(',') || sanitized.includes('"') || sanitized.includes('\n')) {
    return `"${sanitized.replace(/"/g, '""')}"`;
  }
  return sanitized;
};

const padZero = (n: number): string => String(n).padStart(2, '0');

export const formatDateTime = (date: Date): string => {
  const y = date.getFullYear();
  const m = padZero(date.getMonth() + 1);
  const d = padZero(date.getDate());
  const hh = padZero(date.getHours());
  const mm = padZero(date.getMinutes());
  const ss = padZero(date.getSeconds());
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
};

export const formatDateTimeForFilename = (date: Date): string => {
  const y = date.getFullYear();
  const m = padZero(date.getMonth() + 1);
  const d = padZero(date.getDate());
  const hh = padZero(date.getHours());
  const mm = padZero(date.getMinutes());
  const ss = padZero(date.getSeconds());
  return `${y}-${m}-${d}_${hh}-${mm}-${ss}`;
};

export const generateSalesCsv = (
  sales: Sale[],
  catalogNameResolver: (catalogId: string) => string,
): string => {
  const dataRows = sales.flatMap((sale) => {
    const dateTime = formatDateTime(sale.soldAt);
    return sale.items.map((item) => {
      const catalogName = catalogNameResolver(item.catalogId);
      const subtotal = item.price * item.quantity;
      return [
        escapeCsvField(dateTime),
        escapeCsvField(catalogName),
        escapeCsvField(item.name),
        String(item.price),
        String(item.quantity),
        String(subtotal),
      ].join(',');
    });
  });

  return [CSV_HEADER, ...dataRows].join('\n');
};

export const sanitizeFilename = (name: string): string => {
  // eslint-disable-next-line no-control-regex
  return name.replace(/[\\/:*?"<>|\x00-\x1f]/g, '_').trim() || '_';
};

export const downloadCsv = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
