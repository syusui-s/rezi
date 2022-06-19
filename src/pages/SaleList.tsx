import { Show, For, createMemo } from 'solid-js';
import type { Component } from 'solid-js';

import AppLayout from '@/components/AppLayout';
import NavigationDrawer from '@/components/NavigationDrawer';
import PriceDisplay from '@/components/PriceDisplay';
import ProductCover from '@/components/ProductCover';
import useSales from '@/useSales';
import useCatalogs from '@/useCatalogs';
import type Sale from '@/models/Sale';

type SaleStat = {
  catalogId: string;
  productId: string;
  name: string;
  totalCount: number;
  totalPrice: number;
};

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

const statSalesByProduct = (sales: Sale[]): SaleStat[] => {
  const productStat = new Map<string, SaleStat>();
  sales
    .flatMap((sale) => sale.items)
    .forEach((item) => {
      const stat = productStat.get(item.productId);
      const totalPrice = stat?.totalPrice ?? 0;
      const totalCount = stat?.totalCount ?? 0;
      productStat.set(item.productId, {
        catalogId: item.catalogId,
        productId: item.productId,
        name: item.name,
        totalPrice: totalPrice + item.price * item.quantity,
        totalCount: totalCount + item.quantity,
      });
    });
  return [...productStat.values()].sort((a, b) => b.totalCount - a.totalCount);
};

const SaleList: Component = () => {
  const { sales } = useSales();
  const { findProduct } = useCatalogs();

  const salesGroupedByDate = createMemo(() => groupSalesByDate(sales()));

  return (
    <AppLayout titleElement="頒布履歴" prevElement={<NavigationDrawer />}>
      <div>
        <For each={salesGroupedByDate()}>
          {([date, groupedSales]) => {
            const salesStat = statSalesByProduct(groupedSales);

            return (
              <div class="p-4 mb-4 rounded-md border">
                <h2 class="pb-4 text-2xl font-bold text-center">{date}</h2>
                <div class="grid grid-cols-1 p-4 mb-4 rounded-md border md:grid-cols-2">
                  <For each={salesStat}>
                    {(stat) => {
                      const product = findProduct(stat.catalogId, stat.productId);
                      return (
                        <div class="flex items-center py-1">
                          <div class="shrink-0 w-16 h-16">
                            <Show when={product}>{(p) => <ProductCover product={p} />}</Show>
                          </div>
                          <div class="shrink-0 mr-8 w-16 text-4xl font-bold text-right">
                            {stat.totalCount}
                          </div>
                          <div class="overflow-hidden text-2xl text-ellipsis whitespace-pre break-all">
                            {stat.name}
                          </div>
                        </div>
                      );
                    }}
                  </For>
                </div>
                <For each={groupedSales}>
                  {(sale) => {
                    return (
                      <div class="p-4 mb-4 rounded-md border">
                        <div class="text-xl font-bold text-center">
                          {sale.soldAt.toLocaleTimeString()}
                        </div>
                        <ul class="rounded border">
                          <For each={sale.items}>
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
                  }}
                </For>
              </div>
            );
          }}
        </For>
      </div>
    </AppLayout>
  );
};

export default SaleList;
