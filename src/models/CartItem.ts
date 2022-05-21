export default class CartItem {
  constructor(readonly productId: string, readonly amount: number) {}

  static one(productId: string) {
    return new CartItem(productId, 1);
  }

  addAmount(amount: number): CartItem {
    if (!(amount > 0)) throw new Error('Try to add zero or minus amount');
    return new CartItem(this.productId, this.amount + amount);
  }

  removeAmount(amount: number): CartItem {
    if (!(amount > 0)) throw new Error('Try to remove zero or minus amount');
    if (amount > this.amount) throw new Error('Try to remove more than current amount');
    return new CartItem(this.productId, this.amount - amount);
  }
}
