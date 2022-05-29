import { Show } from 'solid-js';
import type { Component } from 'solid-js';
import { Link, useNavigate, useParams } from 'solid-app-router';

import Product from '@/models/Product';
import AppLayout from '@/components/AppLayout';
import ProductForm from '@/components/ProductForm';
import NotFound from '@/pages/NotFound';
import useCatalogs from '@/useCatalogs';
import generateId from '@/utils/generateId';

const ManageProduct: Component = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { currentCatalog, saveProduct, findProduct } = useCatalogs();

  const isCreatePage = () => params.id == null;

  const getProduct = () => findProduct(currentCatalog().id, params.id);

  const handleProductFormSubmit = ({
    name,
    price,
    imageUrl,
  }: {
    name: string;
    price: number;
    imageUrl?: string;
  }) => {
    const id = getProduct()?.id ?? generateId();
    const product = new Product(id, name, price, imageUrl);
    saveProduct(currentCatalog().id, product);
    navigate('/catalogs/current');
  };

  return (
    <Show when={isCreatePage() || getProduct() != null} fallback={<NotFound />}>
      <AppLayout
        titleElement="頒布物登録"
        prevElement={
          <Link href="/catalogs/current" class="navigationButton">
            ←
          </Link>
        }
      >
        <ProductForm product={getProduct()} onSubmit={handleProductFormSubmit} />
      </AppLayout>
    </Show>
  );
};

export default ManageProduct;
