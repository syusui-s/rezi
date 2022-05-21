import { createSignal } from 'solid-js';
import type { Accessor } from 'solid-js';
import Product from './models/Product';
import Cart from './models/Cart';

type UseCartProps = {
  products: Accessor<Product[]>;
};

type UseCart = {
  cart: Accessor<Cart>;
  addToCart: (productId: string, amount?: number) => void;
  removeFromCart: (productId: string, amount?: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
};

const useCart = ({ products }: UseCartProps): UseCart => {
  const [cart, setCart] = createSignal<Cart>(Cart.empty());

  const addToCart = (productId: string, amount = 1) => {
    setCart((currentCart) => currentCart.add(productId, amount));
  };

  const removeFromCart = (productId: string, amount = 1) => {
    setCart((currentCart) => currentCart.remove(productId, amount));
  };

  const clearCart = () => setCart(Cart.empty());

  const totalPrice = () => {
    return cart()
      .content()
      .reduce((acc, cartItem) => {
        const product = products().find(({ id }) => id === cartItem.productId);

        if (!product) return acc;
        return acc + product.price * cartItem.amount;
      }, 0);
  };

  return { cart, addToCart, removeFromCart, clearCart, totalPrice };
};

export default useCart;
