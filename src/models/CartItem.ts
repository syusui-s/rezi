/**
 * カート品
 */
export default class CartItem {
  constructor(readonly productId: string, readonly quantity: number) {}

  static one(productId: string) {
    return new CartItem(productId, 1);
  }

  addQuantity(quantity: number): CartItem {
    if (!(quantity > 0)) throw new Error('Try to add zero or minus quantity');
    return new CartItem(this.productId, this.quantity + quantity);
  }

  removeQuantity(quantity: number): CartItem {
    if (!(quantity > 0)) throw new Error('Try to remove zero or minus quantity');
    if (quantity > this.quantity) throw new Error('Try to remove more than current quantity');
    return new CartItem(this.productId, this.quantity - quantity);
  }
}
