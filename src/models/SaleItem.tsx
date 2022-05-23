/**
 * 売上明細
 */
export default class SaleItem {
  constructor(
    readonly productId: string,
    /** 品名 */
    readonly productName: string,
    /** 単価 */
    readonly price: number,
    /** 数量 */
    readonly quantity: number,
  ) {}
}
