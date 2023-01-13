import { createSignal } from 'solid-js';
import type { Accessor } from 'solid-js';

import Cart from '@/models/Cart';
import Sale from '@/models/Sale';
import SaleItem from '@/models/SaleItem';
import Catalog from '@/models/Catalog';
import useCatalogs from '@/useCatalogs';
import generateId from '@/utils/generateId';
import { createStorageWithSerializer, createSignalWithStorage } from '@/createSignalWithStorage';
import { deserializeSales, serializeSales } from '@/serialize/sale';

export type UseSales = {
  sales: Accessor<Sale[]>;
  register: (catalog: Catalog, cart: Cart) => void;
  remove: (catalogId: string) => void;
};

const LOCAL_STORAGE_KEY = 'ReziSales';

const salesStorage = createStorageWithSerializer<Sale[]>(
  () => window.localStorage,
  serializeSales,
  deserializeSales,
);

const [sales, setSales] = createSignalWithStorage<Sale[]>(LOCAL_STORAGE_KEY, [], salesStorage);

const useSales = (): UseSales => {
  const { findProduct } = useCatalogs();

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

  const remove = (cartId: string) => {
    setSales([...sales()].filter((e) => e.id !== cartId));
  };

  return {
    sales,
    register,
    remove,
  };
};

export default useSales;
