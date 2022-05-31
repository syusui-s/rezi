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
        {(catalog) => <Link href={`/catalogs/${catalog.id}`}>{catalog.name}</Link>}
      </For>
      <Link href={`/catalogs/abcde`}>abcde</Link>
    </AppLayout>
  );
};

export default CatalogList;
