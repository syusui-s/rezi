import { createSignal } from 'solid-js';
import type { Accessor } from 'solid-js';

import Product from '@/models/Product';
import Cart from '@/models/Cart';

type UseCartProps = {
  products: Accessor<Product[]>;
};

type UseCart = {
  cart: Accessor<Cart>;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string, quantity?: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalQuantity: () => number;
};

const useCart = ({ products }: UseCartProps): UseCart => {
  const [cart, setCart] = createSignal<Cart>(Cart.empty());

  const addToCart = (productId: string, quantity = 1) => {
    setCart((currentCart) => currentCart.add(productId, quantity));
  };

  const removeFromCart = (productId: string, quantity = 1) => {
    setCart((currentCart) => currentCart.remove(productId, quantity));
  };

  const clearCart = () => setCart(Cart.empty());

  const totalQuantity = () =>
    cart()
      .content()
      .reduce((acc, e) => acc + e.quantity, 0);

  const totalPrice = () =>
    cart()
      .content()
      .reduce((acc, cartItem) => {
        const product = products().find(({ id }) => id === cartItem.productId);

        if (!product) return acc;
        return acc + product.price * cartItem.quantity;
      }, 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    totalPrice,
    totalQuantity,
  };
};

export default useCart;
