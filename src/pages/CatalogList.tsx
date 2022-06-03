import { For } from 'solid-js';
import type { Component } from 'solid-js';
import { Link } from 'solid-app-router';

import ProductCover from '@/components/ProductCover';
import useCatalogs from '@/useCatalogs';
import AppLayout from '@/components/AppLayout';

const CatalogList: Component = () => {
  const { catalogs } = useCatalogs();

  return (
    <AppLayout titleElement="カタログ▲">
      <For each={Object.values(catalogs())}>
        {(catalog) => (
          <Link href={`/catalogs/${catalog.id}`}>
            <div class="flex flex-row items-center p-4 m-4 hover:bg-zinc-50 rounded border shadow">
              <div class="w-48">
                <div class="text-3xl font-bold">{catalog.name}</div>
                <div class="text-xl">{Object.keys(catalog.products).length}個</div>
              </div>
              <div class="flex overflow-hidden gap-2 m-4 h-24">
                <For each={Object.values(catalog.products).slice(0, 5)}>
                  {(product) => (
                    <div class="w-24 h-24 rounded-lg">
                      <ProductCover product={product} />
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Link>
        )}
      </For>
    </AppLayout>
  );
};

export default CatalogList;
