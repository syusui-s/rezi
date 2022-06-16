import { For, createMemo } from 'solid-js';
import type { Component } from 'solid-js';
import { Link } from 'solid-app-router';

import AppLayout from '@/components/AppLayout';
import NavigationDrawer from '@/components/NavigationDrawer';
import PriceDisplay from '@/components/PriceDisplay';
import useSales from '@/useSales';
import type Sale from '@/models/Sale';

type SaleStat = {
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
                <div class="p-4 mb-4 rounded-md border">
                  <For each={salesStat}>
                    {(stat) => (
                      <div class="flex items-center p-2">
                        <div class="text-xl font-bold">{stat.name}</div>
                        <div class="ml-4 text-4xl">{stat.totalCount}</div>
                      </div>
                    )}
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
