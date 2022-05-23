import CartItem from './CartItem';

/**
 * カート
 */
export default class Cart {
  constructor(private items: Record<string, CartItem>) {}

  static empty(): Cart {
    return new Cart({});
  }

  add(productId: string, quantity: number) {
    const item = this.find(productId);
    const newItems = { ...this.items };

    if (item) {
      newItems[productId] = item.addQuantity(quantity);
    } else {
      newItems[productId] = CartItem.one(productId);
    }

    return new Cart(newItems);
  }

  remove(productId: string, quantity: number) {
    const item = this.find(productId);
    const newItems = { ...this.items };

    if (!item) throw new Error('Try to remove not added product');

    const newItem = item.removeQuantity(quantity);

    newItems[productId] = newItem;
    /*
    if (newItem.quantity > 0) {
      newItems[productId] = newItem;
    } else {
      delete newItems[productId];
    }
    */

    return new Cart(newItems);
  }

  find(productId: string): CartItem | undefined {
    return this.items[productId];
  }

  isEmpty(): boolean {
    return Object.keys(this.items).length === 0;
  }

  content(): CartItem[] {
    return Object.values(this.items);
  }
}
