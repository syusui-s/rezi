import { createSignal, onMount, createEffect } from 'solid-js';
import type { Accessor } from 'solid-js';

import Cart from '@/models/Cart';
import Sale from '@/models/Sale';
import SaleItem from '@/models/SaleItem';
import Catalog from '@/models/Catalog';
import useCatalogs from '@/useCatalogs';
import generateId from '@/utils/generateId';
import { deserializeSales, serializeSales } from '@/serialize/sale';

export type UseSales = {
  sales: Accessor<Sale[]>;
  register: (catalog: Catalog, cart: Cart) => void;
};

const [sales, setSales] = createSignal<Sale[]>([]);

const useSales = (): UseSales => {
  const [loaded, setLoaded] = createSignal<boolean>(false);
  const { findProduct } = useCatalogs();

  onMount(() => {
    const data = globalThis.localStorage.getItem('sales');

    if (data === null) {
      setLoaded(true);
      return;
    }

    const deserialized = deserializeSales(data);
    if (deserialized != null) {
      setSales(deserialized);
    }
    setLoaded(true);
  });

  createEffect(() => {
    if (loaded()) {
      window.localStorage.setItem('sales', serializeSales(sales()));
    }
  });

  const register = (catalog: Catalog, cart: Cart) => {
    const saleItems = cart
      .content()
      .map((cartItem) => {
        const product = findProduct(catalog.id, cartItem.productId);
        if (product == null) return null;
        return SaleItem.fromProduct(catalog.id, product, cartItem.quantity);
      })
      .filter(<T>(e: T | null): e is T => e != null);
    const sale = new Sale(generateId(), new Date(), saleItems);

    setSales([...sales(), sale]);
  };

  return {
    sales,
    register,
  };
};

export default useSales;
