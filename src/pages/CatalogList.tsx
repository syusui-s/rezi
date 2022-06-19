import { For, createSignal, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { Link } from 'solid-app-router';

import AppLayout from '@/components/AppLayout';
import NavigationDrawer from '@/components/NavigationDrawer';
import ProductCover from '@/components/ProductCover';
import useCatalogs from '@/useCatalogs';

const CatalogList: Component = () => {
  const { catalogs, removeCatalog } = useCatalogs();

  const [editing, setEditing] = createSignal(false);

  return (
    <AppLayout
      titleElement="カタログ一覧"
      prevElement={<NavigationDrawer />}
      nextElement={
        <Show
          when={editing()}
          fallback={
            <button class="navigationButton" onClick={() => setEditing(true)}>
              編集
            </button>
          }
        >
          <div class="flex flex-row gap-4 items-center">
            <Link href={`/catalogs/new`} class="navigationButton">
              ＋
            </Link>
            <button class="navigationButton" onClick={() => setEditing(false)}>
              完了
            </button>
          </div>
        </Show>
      }
    >
      <For each={Object.values(catalogs())}>
        {(catalog) => (
          <div class="py-2 px-4 my-4 hover:bg-zinc-50 rounded border shadow">
            <Link href={`/catalogs/${encodeURIComponent(catalog.id)}/products`}>
              <div class="flex overflow-hidden flex-row items-center ">
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
            <Show when={editing()}>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    // eslint-disable-next-line no-alert
                    if (window.confirm('本当に削除しますか？')) {
                      removeCatalog(catalog.id);
                    }
                  }}
                  area-label="削除"
                  class="text-xs text-red-500 md:text-base"
                >
                  削除
                </button>
              </div>
            </Show>
          </div>
        )}
      </For>
    </AppLayout>
  );
};

export default CatalogList;
