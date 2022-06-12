import { Show } from 'solid-js';
import type { Component, JSX } from 'solid-js';

export type DrawerDisplayProps = {
  open: boolean;
  onClose: () => void;
  children?: JSX.Element;
};

const DrawerDisplay: Component<DrawerDisplayProps> = (props) => {
  return (
    <Show when={props.open}>
      <div class="flex fixed top-0 left-0 z-50 flex-row w-full h-full bg-black/30">
        <div class="fixed top-0 z-50 w-1/3 min-w-min h-full bg-white drop-shadow-2xl lg:w-1/5">
          {props.children}
        </div>
        <button
          aria-label="Close drawer"
          class="flex-auto h-full"
          onClick={() => props.onClose()}
        />
      </div>
    </Show>
  );
};

export default DrawerDisplay;
