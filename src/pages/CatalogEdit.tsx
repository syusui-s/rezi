import { Show } from 'solid-js';
import type { Component } from 'solid-js';
import { Link, useNavigate, useParams } from '@solidjs/router';

import Catalog from '@/models/Catalog';
import AppLayout from '@/components/AppLayout';
import CatalogForm from '@/components/CatalogForm';
import NotFound from '@/pages/NotFound';
import useCatalogs from '@/useCatalogs';
import generateId from '@/utils/generateId';

const CatalogEdit: Component = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { findCatalog, saveCatalog } = useCatalogs();

  const getCatalog = () => (params.catalogId != null ? findCatalog(params.catalogId) : undefined);

  const isCreatePage = () => params.catalogId == null;

  const handleCatalogFormSubmit = ({ name }: { name: string }) => {
    const catalog = getCatalog();
    const id = catalog?.id ?? generateId();
    const newCatalog = new Catalog(id, name, catalog?.products ?? {});
    saveCatalog(newCatalog);
    navigate(`/catalogs/${id}/products`);
  };

  return (
    <Show when={isCreatePage() || getCatalog() != null} fallback={<NotFound />}>
      <AppLayout
        titleElement={isCreatePage() ? 'カタログ登録' : 'カタログ更新'}
        prevElement={
          <Link href={`/catalogs`} class="navigationButton">
            ←
          </Link>
        }
      >
        <div class="px-4">
          <CatalogForm catalog={getCatalog()} onSubmit={handleCatalogFormSubmit} />
        </div>
      </AppLayout>
    </Show>
  );
};

export default CatalogEdit;
