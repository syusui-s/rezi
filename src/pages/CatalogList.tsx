import { For } from 'solid-js';
import type { Component } from 'solid-js';
import { Link } from 'solid-app-router';

import useCatalogs from '@/useCatalogs';
import AppLayout from '@/components/AppLayout';

const CatalogList: Component = () => {
  const { catalogs } = useCatalogs();

  return (
    <AppLayout titleElement="カタログ▲">
      <For each={Object.values(catalogs())}>
        {(catalog) => (
          <div>
            <Link href={`/catalogs/${catalog.id}`}>{catalog.name}</Link>
          </div>
        )}
      </For>
    </AppLayout>
  );
};

export default CatalogList;
