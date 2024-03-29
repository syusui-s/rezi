import { Show } from 'solid-js';
import type { Component } from 'solid-js';
import { Link, useNavigate, useParams } from '@solidjs/router';

import Product from '@/models/Product';
import AppLayout from '@/components/AppLayout';
import ProductForm from '@/components/ProductForm';
import NotFound from '@/pages/NotFound';
import useCatalogs from '@/useCatalogs';
import generateId from '@/utils/generateId';

const ProductView: Component = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { findCatalog, saveProduct, findProduct } = useCatalogs();

  const getCatalog = () => (params.catalogId != null ? findCatalog(params.catalogId) : undefined);

  const isCreatePage = () => params.productId == null;

  const getProduct = () => {
    const catalog = getCatalog();
    if (catalog == null) return undefined;
    return findProduct(catalog.id, params.productId);
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
    navigate(`/catalogs/${catalog.id}/products`);
  };

  return (
    <Show when={isCreatePage() || getProduct() != null} fallback={<NotFound />}>
      <AppLayout
        titleElement="頒布物登録"
        prevElement={
          <Link href={`/catalogs/${params.catalogId}/products`} class="navigationButton">
            ←
          </Link>
        }
      >
        <div class="px-4">
          <ProductForm product={getProduct()} onSubmit={handleProductFormSubmit} />
        </div>
      </AppLayout>
    </Show>
  );
};

export default ProductView;
