import Sale from '@/models/Sale';
import SaleItem from '@/models/SaleItem';

export type SaleSerialized = {
  id: string;
  soldAt: string;
  items: SaleItemSerialized[];
};

export type SaleItemSerialized = {
  catalogId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export const deserializeSales = (data: string | null): Sale[] | null => {
  if (data === null) return null;

  const parsed = JSON.parse(data) as SaleSerialized[];
  return parsed.map((rawSale) => {
    const items = rawSale.items.map((rawSaleItem) => {
      return new SaleItem(
        rawSaleItem.catalogId,
        rawSaleItem.productId,
        rawSaleItem.name,
        rawSaleItem.price,
        rawSaleItem.quantity,
      );
    });
    return new Sale(rawSale.id, new Date(rawSale.soldAt), items);
  });
};

export const serializeSales = (sales: Sale[]): string => {
  const data: SaleSerialized[] = sales.map((sale) => ({
    id: sale.id,
    soldAt: sale.soldAt.toISOString(),
    items: sale.items.map((saleItem) => ({
      catalogId: saleItem.catalogId,
      productId: saleItem.productId,
      name: saleItem.name,
      price: saleItem.price,
      quantity: saleItem.quantity,
    })),
  }));

  return JSON.stringify(data);
};
