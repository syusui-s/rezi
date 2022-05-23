import type { Component } from 'solid-js';
import { Link } from 'solid-app-router';

import Product from './models/Product';
import AppLayout from './components/AppLayout';
import ProductForm from './components/ProductForm';
import useProducts from './useProducts';

const ManageProduct: Component = () => {
  const { addProduct, removeProduct } = useProducts();

  const handleProductFormSubmit = ({
    name,
    price,
    imageUrl,
  }: {
    name: string;
    price: number;
    imageUrl?: string;
  }) => {
    const id = Math.random().toString();
    const product = new Product(id, name, price, imageUrl);
    addProduct(product);
  };

  return (
    <AppLayout
      titleElement="頒布物登録"
      prevElement={
        <Link href="/" class="navigationButton">
          &lt; ホーム
        </Link>
      }
    >
      <ProductForm onSubmit={handleProductFormSubmit} />
    </AppLayout>
  );
};

export default ManageProduct;
