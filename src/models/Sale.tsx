import SaleItem from './SaleItem';

/**
 * 売上
 */
export default class Sale {
  constructor(
    readonly id: string,
    /** 売上日時 */
    readonly soldAt: Date,
    /** 売上明細 */
    readonly items: ReadonlyArray<SaleItem>,
  ) {}
}
