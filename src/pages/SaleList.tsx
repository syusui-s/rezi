import { For, createMemo } from 'solid-js';
import type { Component } from 'solid-js';
import { Link } from 'solid-app-router';

import AppLayout from '@/components/AppLayout';
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
            <div class="border p-4 rounded-md">
              <h2 class="text-2xl font-bold text-center pb-4">{date}</h2>
              <div></div>
              <For each={groupedSales}>
                {(sale) => {
                  return (
                    <div class="border p-4 rounded-md mb-4">
                      <div class="text-xl font-bold text-center">
                        {sale.soldAt.toLocaleTimeString()}
                      </div>
                      <ul class="border rounded">
                        <For each={sale.items}>
                          {(saleItem) => {
                            return (
                              <li class="flex items-center justify-between p-1 border-b last:border-none">
                                <div class="flex-auto">{saleItem.name}</div>
                                <div class="basis-1/12 text-right">{saleItem.price}</div>
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
