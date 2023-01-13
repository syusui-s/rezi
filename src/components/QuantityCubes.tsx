import { For } from 'solid-js';
import type { Component } from 'solid-js';

const QuantityCubes: Component<{ quantity: number }> = (props) => (
  <div class="grid w-20 grid-cols-5 gap-1 sm:gap-2 lg:w-32">
    <For each={Array(props.quantity).splice(0, 10)}>
      {() => (
        <div
          class="h-3 w-3 bg-white md:h-4 md:w-4"
          style={{ 'box-shadow': '2px 2px 2px rgba(0,0,0,0.7)' }}
        />
      )}
    </For>
  </div>
);

export default QuantityCubes;
