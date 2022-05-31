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

  const { findCatalog, saveProduct, findProduct } = useCatalogs();

  const getCatalog = () => (params.catalogId != null ? findCatalog(params.catalogId) : undefined);

  const isCreatePage = () => params.id == null;

  const getProduct = () => {
    const catalog = getCatalog();
    if (catalog == null) return undefined;
    return findProduct(catalog.id, params.id);
  };

  const handleProductFormSubmit = ({
    name,
    price,
    imageUrl,
  }: {
    name: string;
    price: number;
    imageUrl?: string;
  }) => {
    const catalog = getCatalog();
    if (catalog == null) return;

    const id = getProduct()?.id ?? generateId();
    const product = new Product(id, name, price, imageUrl);
    saveProduct(catalog.id, product);
    navigate(`/catalogs/${catalog.id}`);
  };

  return (
    <Show when={isCreatePage() || getProduct() != null} fallback={<NotFound />}>
      <AppLayout
        titleElement="頒布物登録"
        prevElement={
          <Link href={`/catalogs/${params.catalogId}`} class="navigationButton">
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
