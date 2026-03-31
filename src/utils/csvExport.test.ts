import assert from 'assert';
import { describe, it } from 'mocha';
import Sale from '../models/Sale';
import SaleItem from '../models/SaleItem';
import {
  escapeCsvField,
  formatDateTime,
  formatDateTimeForFilename,
  generateSalesCsv,
  sanitizeFilename,
} from './csvExport';

describe('escapeCsvField', () => {
  it('should return the field as-is when no special characters', () => {
    assert.strictEqual(escapeCsvField('hello'), 'hello');
  });

  it('should wrap in quotes when field contains a comma', () => {
    assert.strictEqual(escapeCsvField('a,b'), '"a,b"');
  });

  it('should wrap in quotes when field contains a newline', () => {
    assert.strictEqual(escapeCsvField('a\nb'), '"a\nb"');
  });

  it('should escape double quotes by doubling them', () => {
    assert.strictEqual(escapeCsvField('say "hello"'), '"say ""hello"""');
  });

  it('should handle empty string', () => {
    assert.strictEqual(escapeCsvField(''), '');
  });

  it('should prefix single quote for formula-dangerous characters', () => {
    assert.strictEqual(escapeCsvField('=SUM(A1)'), "'=SUM(A1)");
    assert.strictEqual(escapeCsvField('+cmd'), "'+cmd");
    assert.strictEqual(escapeCsvField('-value'), "'-value");
    assert.strictEqual(escapeCsvField('@import'), "'@import");
  });
});

describe('formatDateTime', () => {
  it('should format date as YYYY-MM-DD HH:MM:SS', () => {
    const date = new Date(2026, 1, 22, 14, 5, 9); // 2026-02-22 14:05:09
    assert.strictEqual(formatDateTime(date), '2026-02-22 14:05:09');
  });

  it('should pad single-digit values with zero', () => {
    const date = new Date(2026, 0, 3, 1, 2, 3); // 2026-01-03 01:02:03
    assert.strictEqual(formatDateTime(date), '2026-01-03 01:02:03');
  });
});

describe('formatDateTimeForFilename', () => {
  it('should format date as YYYY-MM-DD_HH-MM-SS', () => {
    const date = new Date(2026, 1, 22, 14, 30, 0);
    assert.strictEqual(formatDateTimeForFilename(date), '2026-02-22_14-30-00');
  });
});

describe('generateSalesCsv', () => {
  const catalogNameResolver = (catalogId: string): string => {
    if (catalogId === 'cat1') return 'カタログA';
    return '';
  };

  it('should generate CSV with header and sale items', () => {
    const sales: Sale[] = [
      new Sale('sale1', new Date(2026, 1, 22, 14, 30, 0), [
        new SaleItem('cat1', 'prod1', '本A', 500, 2),
        new SaleItem('cat1', 'prod2', '本B', 1000, 1),
      ]),
    ];

    const csv = generateSalesCsv(sales, catalogNameResolver);
    const lines = csv.split('\n');

    assert.strictEqual(lines.length, 3);
    assert.strictEqual(lines[0], '日時,カタログ名,商品名,単価,数量,小計');
    assert.strictEqual(lines[1], '2026-02-22 14:30:00,カタログA,本A,500,2,1000');
    assert.strictEqual(lines[2], '2026-02-22 14:30:00,カタログA,本B,1000,1,1000');
  });

  it('should return only header when no sales', () => {
    const csv = generateSalesCsv([], catalogNameResolver);
    assert.strictEqual(csv, '日時,カタログ名,商品名,単価,数量,小計');
  });

  it('should escape fields containing commas', () => {
    const sales: Sale[] = [
      new Sale('sale1', new Date(2026, 0, 1, 0, 0, 0), [
        new SaleItem('cat1', 'prod1', 'A,B', 100, 1),
      ]),
    ];

    const csv = generateSalesCsv(sales, catalogNameResolver);
    const lines = csv.split('\n');
    assert.strictEqual(lines[1], '2026-01-01 00:00:00,カタログA,"A,B",100,1,100');
  });

  it('should handle multiple sales', () => {
    const sales: Sale[] = [
      new Sale('sale1', new Date(2026, 1, 22, 10, 0, 0), [
        new SaleItem('cat1', 'prod1', '本A', 500, 1),
      ]),
      new Sale('sale2', new Date(2026, 1, 22, 11, 0, 0), [
        new SaleItem('cat1', 'prod2', '本B', 300, 3),
      ]),
    ];

    const csv = generateSalesCsv(sales, catalogNameResolver);
    const lines = csv.split('\n');

    assert.strictEqual(lines.length, 3);
    assert.strictEqual(lines[1], '2026-02-22 10:00:00,カタログA,本A,500,1,500');
    assert.strictEqual(lines[2], '2026-02-22 11:00:00,カタログA,本B,300,3,900');
  });
});

describe('sanitizeFilename', () => {
  it('should return the name as-is when no special characters', () => {
    assert.strictEqual(sanitizeFilename('カタログA'), 'カタログA');
  });

  it('should replace invalid filename characters with underscores', () => {
    assert.strictEqual(sanitizeFilename('a/b\\c:d'), 'a_b_c_d');
    assert.strictEqual(sanitizeFilename('a*b?c"d'), 'a_b_c_d');
    assert.strictEqual(sanitizeFilename('a<b>c|d'), 'a_b_c_d');
  });

  it('should return underscore for empty string', () => {
    assert.strictEqual(sanitizeFilename(''), '_');
  });
});
