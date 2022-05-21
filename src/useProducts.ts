import { createSignal, createEffect, onMount } from 'solid-js';
import type { Accessor } from 'solid-js';
import Product from './models/Product';

type UseProducts = {
  products: Accessor<Product[]>;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
};

const useProducts = (): UseProducts => {
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

  const addProduct = (product: Product) => {
    setProducts([...products(), product]);
  };

  const removeProduct = (id: string) => {
    setProducts(products().filter(({ id: current }) => current !== id));
  };

  return { products, addProduct, removeProduct };
};

export default useProducts;
