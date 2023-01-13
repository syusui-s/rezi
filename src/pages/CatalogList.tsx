import { For, createSignal, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { Link } from '@solidjs/router';

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
          <div class="flex flex-row items-center gap-4">
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
          <div class="my-4 rounded border py-2 px-4 shadow hover:bg-zinc-50">
            <Link href={`/catalogs/${encodeURIComponent(catalog.id)}/products`}>
              <div class="flex flex-row items-center overflow-hidden ">
                <div class="flex-none basis-1/3">
                  <div class="text-xl font-bold sm:text-3xl">{catalog.name}</div>
                  <div class="sm:text-xl">{Object.keys(catalog.products).length} 個</div>
                </div>
                <div class="m-4 flex h-20 flex-auto shrink-0 flex-row gap-2 overflow-scroll sm:h-24">
                  <For each={Object.values(catalog.products).slice(0, 10)}>
                    {(product) => (
                      <div class="h-20 w-20 sm:h-24 sm:w-24">
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
