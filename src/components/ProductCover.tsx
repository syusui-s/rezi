import { Show } from 'solid-js';
import type { Component } from 'solid-js';

import type Product from '@/models/Product';

export type ProductCoverProps = {
  product: Product;
};

const ProductCover: Component<ProductCoverProps> = (props) => {
  return (
    <Show
      when={props.product.imageUrl != null}
      fallback={
        <div class="mx-auto h-full w-full overflow-hidden whitespace-pre break-all bg-blue-500 p-2 text-lg text-white sm:text-xl md:p-4 md:text-2xl">
          {props.product.name}
        </div>
      }
    >
      <div class="flex h-full w-full justify-center">
        <img
          src={props.product.imageUrl}
          class="max-h-full max-w-full object-contain"
          alt="頒布物の画像"
          draggable={false}
        />
      </div>
    </Show>
  );
};

export default ProductCover;
