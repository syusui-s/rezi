import { Show } from 'solid-js';
import type { Component } from 'solid-js';

import QuantityCubes from '@/components/QuantityCubes';

const QuantityDisplay: Component<{ quantity: number }> = (props) => (
  <Show when={props.quantity > 0}>
    <div
      class="absolute flex h-full w-full flex-col flex-nowrap items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.4)' }}
    >
      <Show
        when={props.quantity <= 10}
        fallback={
          <div
            class="font-mono text-4xl font-bold text-white sm:text-5xl md:text-6xl"
            style={{ 'text-shadow': '1px 1px 4px #000' }}
          >
            {props.quantity}
          </div>
        }
      >
        <QuantityCubes quantity={props.quantity} />
      </Show>
    </div>
  </Show>
);

export default QuantityDisplay;
