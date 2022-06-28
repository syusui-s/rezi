import { Show, For, JSX, createMemo, Switch, Match, createSignal } from 'solid-js';
import type { Component } from 'solid-js';

import AppLayout from '@/components/AppLayout';
import NavigationDrawer from '@/components/NavigationDrawer';
import PriceDisplay from '@/components/PriceDisplay';
import ProductCover from '@/components/ProductCover';
import useSales from '@/useSales';
import useCatalogs from '@/useCatalogs';
import type Sale from '@/models/Sale';
import type { SaleStat } from '@/models/SaleStat';
import { statSalesByProduct, sortStatsByCountDesc, groupStatsByCatalog } from '@/models/SaleStat';

const GroupingMethods = ['catalog', 'daily'] as const;
type GroupingMethod = typeof GroupingMethods[number];

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
      <option value="catalog">カタログ別</option>
      <option value="daily">日別</option>
    </select>
  );
};

type SaleStatsDisplayProps = {
  saleStats: SaleStat[];
};

const SaleStatsDisplay: Component<SaleStatsDisplayProps> = (props) => {
  const { findProduct } = useCatalogs();

  return (
    <div class="grid grid-cols-1 p-4 mb-4 rounded-md border md:grid-cols-2">
      <For each={props.saleStats}>
        {(stat) => {
          const getProduct = () => findProduct(stat.catalogId, stat.productId);
          return (
            <div class="flex items-center py-1">
              <div class="shrink-0 w-16 h-16">
                <Show when={getProduct()}>{(product) => <ProductCover product={product} />}</Show>
              </div>
              <div class="shrink-0 mr-8 w-16 text-4xl font-bold text-right">{stat.totalCount}</div>
              <div class="overflow-hidden text-2xl text-ellipsis whitespace-pre break-all">
                {stat.name}
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
};

type SaleDisplayProps = {
  sale: Sale;
  dateRender: (date: Date) => JSX.Element;
};

const SaleDisplay: Component<SaleDisplayProps> = (props) => {
  return (
    <div class="p-4 mb-4 rounded-md border">
      <div class="text-xl font-bold text-center">{props.sale.soldAt.toLocaleTimeString()}</div>
      <ul class="rounded border">
        <For each={props.sale.items}>
          {(saleItem) => {
            return (
              <li class="flex justify-between items-center p-1 border-b last:border-none">
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
    </div>
  );
};

type SalesDisplayProps = {
  title: string;
  sales: Sale[];
};

const SalesDisplay: Component<SalesDisplayProps> = (props) => {
  const saleStats = createMemo(() => sortStatsByCountDesc(statSalesByProduct(props.sales)));

  return (
    <>
      <h2 class="pb-4 text-2xl font-bold text-center">{props.title}</h2>
      <SaleStatsDisplay saleStats={saleStats()} />
      <For each={props.sales}>
        {(sale) => <SaleDisplay sale={sale} dateRender={(date) => date.toLocaleTimeString()} />}
      </For>
    </>
  );
};

const SaleList: Component = () => {
  const { sales } = useSales();
  const { findCatalog } = useCatalogs();
  const [groupingMethod, setGroupingMethod] = createSignal<GroupingMethod>('catalog');

  const salesGroupedByDate = createMemo(() => groupSalesByDate(sales()));

  return (
    <AppLayout titleElement="頒布履歴" prevElement={<NavigationDrawer />}>
      <div class="p-4 mb-4 rounded-md border">
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
                        <h2 class="pb-4 text-2xl font-bold text-center">{title()}</h2>
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
              {([date, groupedSales]) => <SalesDisplay title={date} sales={groupedSales} />}
            </For>
          </Match>
        </Switch>
      </div>
    </AppLayout>
  );
};

export default SaleList;
