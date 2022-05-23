/**
 * 商品(頒布物)
 */
export default class Product {
  constructor(
    readonly id: string,
    /** 品名 */
    readonly name: string,
    /** 単価 */
    readonly price: number,
    readonly imageUrl?: string,
  ) {}
}
