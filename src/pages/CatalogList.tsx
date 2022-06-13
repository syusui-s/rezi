import { For } from 'solid-js';
import type { Component } from 'solid-js';
import { Link } from 'solid-app-router';

import AppLayout from '@/components/AppLayout';
import NavigationDrawer from '@/components/NavigationDrawer';
import ProductCover from '@/components/ProductCover';
import useCatalogs from '@/useCatalogs';

const CatalogList: Component = () => {
  const { catalogs } = useCatalogs();

  return (
    <AppLayout
      titleElement="カタログ一覧"
      prevElement={<NavigationDrawer />}
      nextElement={
        <Link href={`/catalogs/new`} class="navigationButton">
          ＋
        </Link>
      }
    >
      <For each={Object.values(catalogs())}>
        {(catalog) => (
          <Link href={`/catalogs/${encodeURIComponent(catalog.id)}/products`}>
            <div class="flex overflow-hidden flex-row items-center py-2 px-4 my-4 hover:bg-zinc-50 rounded border shadow">
              <div class="basis-1/3 flex-none">
                <div class="text-xl font-bold sm:text-3xl">{catalog.name}</div>
                <div class="sm:text-xl">{Object.keys(catalog.products).length} 個</div>
              </div>
              <div class="flex overflow-scroll flex-row flex-auto shrink-0 gap-2 m-4 h-20 sm:h-24">
                <For each={Object.values(catalog.products).slice(0, 10)}>
                  {(product) => (
                    <div class="w-20 h-20 sm:w-24 sm:h-24">
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
