import Product from '@/models/Product';

/**
 * 売上明細
 */
export default class SaleItem {
  constructor(
    readonly catalogId: string,
    readonly productId: string,
    /** 品名 */
    readonly name: string,
    /** 単価 */
    readonly price: number,
    /** 数量 */
    readonly quantity: number,
  ) {}

  static fromProduct(catalogId: string, product: Product, quantity: number): SaleItem {
    return new SaleItem(catalogId, product.id, product.name, product.price, quantity);
  }
}
