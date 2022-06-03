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
            <div class="flex overflow-hidden flex-row items-center py-2 px-4 m-4 hover:bg-zinc-50 rounded border shadow">
              <div class="basis-1/3 flex-none">
                <div class="text-xl font-bold sm:text-3xl">{catalog.name}</div>
                <div class="sm:text-xl text">{Object.keys(catalog.products).length}個</div>
              </div>
              <div class="flex overflow-scroll flex-row flex-auto shrink-0 gap-2 m-4 h-24">
                <For each={Object.values(catalog.products).slice(0, 10)}>
                  {(product) => (
                    <div class="w-24 h-24">
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
