import { Show } from 'solid-js';
import type { Component, JSX } from 'solid-js';
// import { Transition } from 'solid-transition-group';

export type DrawerDisplayProps = {
  open: boolean;
  onClose: () => void;
  children?: JSX.Element;
};

const DrawerDisplay: Component<DrawerDisplayProps> = (props) => {
  return (
    <div
      class="flex fixed top-0 left-0 z-50 flex-row w-full h-full transition"
      classList={{
        '-left-full': !props.open,
        'bg-transparent': !props.open,
        'bg-black/30': props.open,
      }}
    >
      <div
        class="fixed top-0 z-50 w-1/2 min-w-min h-full bg-white drop-shadow-2xl transition-all sm:w-1/3 lg:w-1/5"
        classList={{ '-left-full': !props.open, 'left-0': props.open }}
      >
        <button
          aria-label="Close drawer"
          class="py-4 w-full text-2xl hover:bg-zinc-100 active:bg-zinc-200"
          onClick={() => props.onClose()}
        >
          ×
        </button>
        {props.children}
      </div>
      <button aria-label="Close drawer" class="flex-auto h-full" onClick={() => props.onClose()} />
    </div>
  );
};

export default DrawerDisplay;
