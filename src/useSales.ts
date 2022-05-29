import { createSignal, onMount, createEffect } from 'solid-js';
import type { Accessor } from 'solid-js';

import Cart from '@/models/Cart';
import Sale from '@/models/Sale';
import SaleItem from '@/models/SaleItem';
import useProducts from '@/useProducts';
import { deserializeSales, serializeSales } from '@/serialize/sale';

export type UseSales = {
  sales: Accessor<Sale[]>;
  register: (cart: Cart) => void;
};

const [sales, setSales] = createSignal<Sale[]>([]);

const useSales = (): UseSales => {
  const { findProduct } = useProducts();

  onMount(() => {
    const data = globalThis.localStorage.getItem('sales');
    const deserialized = deserializeSales(data);
    if (deserialized == null) return;
    setSales(deserialized);
  });

  createEffect(() => {
    const data = serializeSales(sales());
    window.localStorage.setItem('sales', data);
  });

  const register = (cart: Cart) => {
    const saleItems = cart
      .content()
      .map((cartItem) => {
        const product = findProduct(cartItem.productId);
        if (product == null) return null;
        return SaleItem.fromProduct(product, cartItem.quantity);
      })
      .filter(<T>(e: T | null): e is T => e != null);
    const sale = new Sale(Math.random().toString(), new Date(), saleItems);

    setSales([...sales(), sale]);
  };

  return {
    sales,
    register,
  };
};

export default useSales;
