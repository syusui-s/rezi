import { createSignal, createEffect, onMount } from 'solid-js';
import type { Accessor } from 'solid-js';
import Product from './models/Product';

type UseProducts = {
  products: Accessor<Product[]>;
  findProduct: (id: string) => Product | undefined;
  saveProduct: (product: Product) => void;
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
  const saveProduct = (product: Product) => {
    const index = products().findIndex((e) => e.id === product.id);
    if (index >= 0) {
      const newProducts = [...products()];
      newProducts[index] = product;
      setProducts(newProducts);
    } else {
      setProducts([...products(), product]);
    }
  };

  const removeProduct = (id: string) => {
    setProducts(products().filter((e) => e.id !== id));
  };

  const findProduct = (id: string): Product | undefined => {
    return products().find((e) => e.id === id);
  };

  return { products, findProduct, saveProduct, removeProduct };
};

export default useProducts;
