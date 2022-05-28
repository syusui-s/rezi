import { For, createMemo } from 'solid-js';
import type { Component } from 'solid-js';
import { Link } from 'solid-app-router';

import AppLayout from '@/components/AppLayout';
import PriceDisplay from '@/components/PriceDisplay';
import useSales from '@/useSales';
import type Sale from '@/models/Sale';

const SaleList: Component = () => {
  const { sales } = useSales();

  const salesGrouped = createMemo(() => {
    const dateSales = new Map<string, Sale[]>();
    [...sales()].reverse().forEach((sale) => {
      const key = sale.soldAt.toLocaleDateString();
      const values = dateSales.get(key) ?? [];
      values.push(sale);
      dateSales.set(key, values);
    });
    return [...dateSales.entries()];
  });

  return (
    <AppLayout
      titleElement="売上記録"
      prevElement={
        <Link href="/catalogs/current" class="navigationButton">
          カタログ
        </Link>
      }
    >
      <div>
        <For each={salesGrouped()}>
          {([date, groupedSales]) => (
            <div class="p-4 rounded-md border">
              <h2 class="pb-4 text-2xl font-bold text-center">{date}</h2>
              <div></div>
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
          )}
        </For>
      </div>
    </AppLayout>
  );
};

export default SaleList;
