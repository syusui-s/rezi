import Product from './Product';

/**
 * カタログ
 */
export default class Catalog {
  constructor(readonly id: string, readonly name: string, readonly products: Product[]) {}
}
