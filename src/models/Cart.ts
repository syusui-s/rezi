import CartItem from './CartItem';

export default class Cart {
  constructor(private items: Record<string, CartItem>) {}

  static empty(): Cart {
    return new Cart({});
  }

  add(productId: string, amount: number) {
    const item = this.find(productId);
    const newItems = { ...this.items };

    if (item) {
      newItems[productId] = item.addAmount(amount);
    } else {
      newItems[productId] = CartItem.one(productId);
    }

    return new Cart(newItems);
  }

  remove(productId: string, amount: number) {
    const item = this.find(productId);
    const newItems = { ...this.items };

    if (!item) throw new Error('Try to remove not added product');

    const newItem = item.removeAmount(amount);

    newItems[productId] = newItem;
    /*
    if (newItem.amount > 0) {
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
