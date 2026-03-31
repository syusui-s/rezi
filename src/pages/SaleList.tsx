import { Show, For, JSX, createMemo, Switch, Match, createSignal } from 'solid-js';
import type { Component } from 'solid-js';

import AppLayout from '@/components/AppLayout';
import NavigationDrawer from '@/components/NavigationDrawer';
import PriceDisplay from '@/components/PriceDisplay';
import ProductCover from '@/components/ProductCover';
import useSales from '@/useSales';
import useCatalogs from '@/useCatalogs';
import type Sale from '@/models/Sale';
import type Product from '@/models/Product';
import type { SaleStat } from '@/models/SaleStat';
import { statSalesByProduct, sortStatsByCountDesc, groupStatsByCatalog } from '@/models/SaleStat';
import {
  generateSalesCsv,
  downloadCsv,
  formatDateTimeForFilename,
  sanitizeFilename,
} from '@/utils/csvExport';

const GroupingMethods = ['daily', 'catalog'] as const;
type GroupingMethod = (typeof GroupingMethods)[number];

const groupSalesByDate = (sales: Sale[]) => {
  const dateSales = new Map<string, Sale[]>();
  [...sales].reverse().forEach((sale) => {
    const key = sale.soldAt.toLocaleDateString();
    const values = dateSales.get(key) ?? [];
    values.push(sale);
    dateSales.set(key, values);
  });
  return [...dateSales.entries()];
};

const formatDateForFilename = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

type GroupingMethodSelectProps = {
  value: GroupingMethod;
  onChange: (newMethod: GroupingMethod) => void;
};

const GroupingMethodSelect: Component<GroupingMethodSelectProps> = (props) => {
  const handleChange: JSX.EventHandler<HTMLSelectElement, Event> = (ev) => {
    switch (ev.currentTarget.value) {
      case 'catalog':
        props.onChange('catalog');
        break;
      case 'daily':
        props.onChange('daily');
        break;
      default:
        throw new Error(`Unknown grouping method: ${ev.currentTarget.value}`);
    }
  };

  return (
    <select value={props.value} onChange={handleChange}>
      <option value="daily">日別</option>
      <option value="catalog">カタログ別</option>
    </select>
  );
};

type ExportButtonProps = {
  onClick: () => void;
};

/**
 * DownloadIcon is from heroicons.
 * @see {@link https://heroicons.com} - arrow-down-tray (mini)
 */
const DownloadIcon: Component = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
    <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
    <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
  </svg>
);

const ExportButton: Component<ExportButtonProps> = (props) => {
  return (
    <button
      type="button"
      onClick={() => props.onClick()}
      class="ml-2 inline-flex items-center gap-1 rounded border px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
    >
      <DownloadIcon />
      CSV
    </button>
  );
};

type SaleStatsDisplayProps = {
  saleStats: SaleStat[];
};

const SaleStatsDisplay: Component<SaleStatsDisplayProps> = (props) => {
  const { findProduct } = useCatalogs();

  const totalAmount = createMemo(() => props.saleStats.reduce((sum, e) => sum + e.totalPrice, 0));

  return (
    <div>
      <div class="py-2 text-center text-2xl">
        <PriceDisplay price={totalAmount()} />
      </div>
      <div class="mb-4 grid grid-cols-1 rounded-md border p-4 md:grid-cols-2">
        <For each={props.saleStats}>
          {(stat) => {
            const getProduct = () => findProduct(stat.catalogId, stat.productId);
            return (
              <div class="flex items-center py-1">
                <div class="h-16 w-16 shrink-0">
                  <Show when={getProduct()} keyed>
                    {(product: Product) => <ProductCover product={product} />}
                  </Show>
                </div>
                <div class="mr-8 w-16 shrink-0 text-right text-4xl font-bold">
                  {stat.totalCount}
                </div>
                <div class="overflow-hidden text-ellipsis whitespace-pre break-all text-2xl">
                  {stat.name}
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
};

type SaleDisplayProps = {
  sale: Sale;
  dateRender: (date: Date) => JSX.Element;
  editing: boolean;
  onRemove: (saleId: string) => void;
};

const SaleDisplay: Component<SaleDisplayProps> = (props) => {
  return (
    <div class="mb-4 rounded-md border p-4">
      <div class="p-2 text-center text-xl font-bold">{props.sale.soldAt.toLocaleTimeString()}</div>
      <ul class="rounded border">
        <For each={props.sale.items}>
          {(saleItem) => {
            return (
              <li class="flex items-center justify-between border-b p-1 last:border-none">
                <div class="basis-3/4">{saleItem.name}</div>
                <div class="flex-auto text-right">
                  <PriceDisplay price={saleItem.price} />
                </div>
                <div class="basis-1/12 text-right">x {saleItem.quantity}</div>
              </li>
            );
          }}
        </For>
      </ul>
      <div class="text-right">
        <Show when={props.editing}>
          <button
            type="button"
            onClick={() => props.onRemove(props.sale.id)}
            class="text-xs text-red-500 md:text-base"
          >
            削除
          </button>
        </Show>
      </div>
    </div>
  );
};

type SalesDisplayProps = {
  title: string;
  sales: Sale[];
  editing: boolean;
  onRemove: (saleId: string) => void;
  onExport: () => void;
};

const SalesDisplay: Component<SalesDisplayProps> = (props) => {
  const saleStats = createMemo(() => sortStatsByCountDesc(statSalesByProduct(props.sales)));

  return (
    <>
      <h2 class="flex items-center justify-center pb-4 text-2xl font-bold">
        {props.title}
        <ExportButton onClick={props.onExport} />
      </h2>
      <SaleStatsDisplay saleStats={saleStats()} />
      <For each={props.sales}>
        {(sale) => (
          <SaleDisplay
            sale={sale}
            dateRender={(date) => date.toLocaleTimeString()}
            editing={props.editing}
            onRemove={props.onRemove}
          />
        )}
      </For>
    </>
  );
};

const SaleList: Component = () => {
  const [editing, setEditing] = createSignal<boolean>(false);
  const { sales, remove: removeSale } = useSales();
  const { findCatalog } = useCatalogs();
  const [groupingMethod, setGroupingMethod] = createSignal<GroupingMethod>('daily');

  const salesGroupedByDate = createMemo(() => groupSalesByDate(sales()));

  const catalogNameResolver = (catalogId: string): string => findCatalog(catalogId)?.name ?? '';

  const handleExportDaily = (groupedSales: Sale[]) => {
    const csv = generateSalesCsv(groupedSales, catalogNameResolver);
    const dateLabel =
      groupedSales.length > 0 ? formatDateForFilename(groupedSales[0].soldAt) : 'empty';
    const exportTime = formatDateTimeForFilename(new Date());
    downloadCsv(csv, `rezi-sales-${dateLabel}_${exportTime}.csv`);
  };

  const handleExportCatalog = (catalogId: string, catalogName: string) => {
    const filteredSales = sales().filter((sale) =>
      sale.items.some((item) => item.catalogId === catalogId),
    );
    const filteredSalesWithItems = filteredSales.map((sale) => {
      const items = sale.items.filter((item) => item.catalogId === catalogId);
      return { ...sale, items } as Sale;
    });
    const csv = generateSalesCsv(filteredSalesWithItems, catalogNameResolver);
    const exportTime = formatDateTimeForFilename(new Date());
    downloadCsv(csv, `rezi-sales-${sanitizeFilename(catalogName)}_${exportTime}.csv`);
  };

  const handleRemove = (saleId: string) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('本当に削除しますか？')) {
      removeSale(saleId);
    }
  };

  return (
    <AppLayout
      titleElement="頒布履歴"
      prevElement={<NavigationDrawer />}
      nextElement={
        <Show
          when={editing()}
          fallback={
            <Show when={groupingMethod() === 'daily'}>
              <button class="navigationButton" onClick={() => setEditing(true)}>
                編集
              </button>
            </Show>
          }
        >
          <button class="navigationButton" onClick={() => setEditing(false)}>
            完了
          </button>
        </Show>
      }
    >
      <div class="mb-4 rounded-md border p-4">
        <div class="py-4">
          <GroupingMethodSelect value={groupingMethod()} onChange={setGroupingMethod} />
        </div>
        <Switch>
          <Match when={groupingMethod() === 'catalog'}>
            {() => {
              const saleStatsGroupedByCatalog = () =>
                groupStatsByCatalog(sortStatsByCountDesc(statSalesByProduct(sales())));
              return (
                <For each={[...saleStatsGroupedByCatalog().entries()]}>
                  {([catalogId, saleStats]) => {
                    const title = () => findCatalog(catalogId)?.name ?? '削除されたカタログ';
                    return (
                      <div class="">
                        <h2 class="flex items-center justify-center pb-4 text-2xl font-bold">
                          {title()}
                          <ExportButton onClick={() => handleExportCatalog(catalogId, title())} />
                        </h2>
                        <SaleStatsDisplay saleStats={saleStats} />
                      </div>
                    );
                  }}
                </For>
              );
            }}
          </Match>
          <Match when={groupingMethod() === 'daily'}>
            <For each={salesGroupedByDate()}>
              {([date, groupedSales]) => (
                <SalesDisplay
                  title={date}
                  sales={groupedSales}
                  editing={editing()}
                  onRemove={handleRemove}
                  onExport={() => handleExportDaily(groupedSales)}
                />
              )}
            </For>
          </Match>
        </Switch>
      </div>
    </AppLayout>
  );
};

export default SaleList;
