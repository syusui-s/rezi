import Sale from './Sale';

export type SaleStat = {
  catalogId: string;
  productId: string;
  name: string;
  totalCount: number;
  totalPrice: number;
};

export const statSalesByProduct = (sales: Sale[]): Map<string, SaleStat> => {
  const result = new Map<string, SaleStat>();
  sales
    .flatMap((sale) => sale.items)
    .forEach((item) => {
      const stat = result.get(item.productId);
      const totalPrice = stat?.totalPrice ?? 0;
      const totalCount = stat?.totalCount ?? 0;
      result.set(item.productId, {
        catalogId: item.catalogId,
        productId: item.productId,
        name: item.name,
        totalPrice: totalPrice + item.price * item.quantity,
        totalCount: totalCount + item.quantity,
      });
    });
  return result;
};

export const sortStatsByCountDesc = (saleStats: Map<string, SaleStat>): SaleStat[] => {
  return [...saleStats.values()].sort((a, b) => b.totalCount - a.totalCount);
};
