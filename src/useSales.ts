import { createSignal, onMount, createEffect } from 'solid-js';
import type { Accessor } from 'solid-js';

import Cart from '@/models/Cart';
import Sale from '@/models/Sale';
import SaleItem from '@/models/SaleItem';
import useProducts from '@/useProducts';

export type UseSales = {
  sales: Accessor<Sale[]>;
  register: (cart: Cart) => void;
};

type SaleSerialized = {
  id: string;
  soldAt: string;
  items: SaleItemSerialized[];
};

type SaleItemSerialized = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

const deserializeSales = (data: string | null): Sale[] | null => {
  if (data === null) return null;

  const parsed = JSON.parse(data) as SaleSerialized[];
  return parsed.map((rawSale) => {
    const items = rawSale.items.map((rawSaleItem) => {
      return new SaleItem(
        rawSaleItem.productId,
        rawSaleItem.name,
        rawSaleItem.price,
        rawSaleItem.quantity,
      );
    });
    return new Sale(rawSale.id, new Date(rawSale.soldAt), items);
  });
};

const serializeSales = (sales: Sale[]): string => {
  const data: SaleSerialized[] = sales.map((sale) => ({
    id: sale.id,
    soldAt: sale.soldAt.toISOString(),
    items: sale.items.map((saleItem) => ({
      productId: saleItem.productId,
      name: saleItem.name,
      price: saleItem.price,
      quantity: saleItem.quantity,
    })),
  }));

  return JSON.stringify(data);
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
