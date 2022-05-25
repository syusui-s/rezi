import Product from '@/models/Product';

/**
 * 売上明細
 */
export default class SaleItem {
  constructor(
    readonly productId: string,
    /** 品名 */
    readonly name: string,
    /** 単価 */
    readonly price: number,
    /** 数量 */
    readonly quantity: number,
  ) {}

  static fromProduct(product: Product, quantity: number): SaleItem {
    return new SaleItem(product.id, product.name, product.price, quantity);
  }
}
