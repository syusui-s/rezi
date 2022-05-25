import { createSignal, createEffect, onMount } from 'solid-js';
import type { Accessor } from 'solid-js';
import Product from './models/Product';

type UseProducts = {
  products: Accessor<Product[]>;
  findProduct: (id: string) => Product | undefined;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
};

const [products, setProducts] = createSignal<Product[]>([]);

onMount(() => {
  const lastProducts = globalThis.localStorage.getItem('products');
  if (lastProducts === null) return;

  setProducts(JSON.parse(lastProducts));
});

createEffect(() => {
  const currentProducts = JSON.stringify(products());
  window.localStorage.setItem('products', currentProducts);
});

const useProducts = (): UseProducts => {
  const addProduct = (product: Product) => {
    setProducts([...products(), product]);
  };

  const removeProduct = (id: string) => {
    setProducts(products().filter(({ id: current }) => current !== id));
  };

  const findProduct = (id: string): Product | undefined => {
    return products().find((e) => e.id === id);
  };

  return { products, findProduct, addProduct, removeProduct };
};

export default useProducts;
