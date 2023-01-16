import rearrangeObjectEntry from '@/utils/rearrangeObjectEntry';
import Product from './Product';

/**
 * カタログ
 */
export default class Catalog {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly products: Record<string, Product>,
  ) {}

  static create(id: string, name: string) {
    return new Catalog(id, name, {});
  }

  saveProduct(product: Product): Catalog {
    const newProducts = { ...this.products };
    newProducts[product.id] = product;
    return new Catalog(this.id, this.name, newProducts);
  }

  removeProduct(productId: string): Catalog {
    const newProducts = { ...this.products };
    delete newProducts[productId];
    return new Catalog(this.id, this.name, newProducts);
  }

  findProduct(productId: string): Product | undefined {
    return this.products[productId];
  }

  rearrangeProduct(productId: string, insertBeforeId: string): Catalog {
    const newProducts = rearrangeObjectEntry(this.products, productId, insertBeforeId);
    return new Catalog(this.id, this.name, newProducts);
  }

  getProductArray(): Product[] {
    return Object.values(this.products);
  }
}
