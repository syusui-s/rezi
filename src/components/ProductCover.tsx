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
        <div class="overflow-hidden p-2 mx-auto w-full h-full text-lg text-white whitespace-pre break-all bg-blue-500 sm:text-xl md:p-4 md:text-2xl">
          {props.product.name}
        </div>
      }
    >
      <div class="flex justify-center w-full h-full">
        <img
          src={props.product.imageUrl}
          class="object-contain max-w-full max-h-full"
          alt="頒布物の画像"
        />
      </div>
    </Show>
  );
};

export default ProductCover;
