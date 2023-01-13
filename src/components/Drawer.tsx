import { createSignal, Component, JSX } from 'solid-js';

import DrawerDisplay from '@/components/DrawerDisplay';

export type DrawerProps = {
  buttonContent: JSX.Element;
  buttonStyle?: JSX.StyleHTMLAttributes<HTMLStyleElement> | string;
  children: JSX.Element;
};

const Drawer: Component<DrawerProps> = (props) => {
  const [open, setOpen] = createSignal(false);

  return (
    <>
      <button
        title="Close drawer"
        type="button"
        class="h-full p-2 hover:bg-zinc-100 active:bg-zinc-200 md:py-4"
        onClick={() => setOpen(true)}
      >
        {props.buttonContent}
      </button>
      <DrawerDisplay open={open()} onClose={() => setOpen(false)}>
        {props.children}
      </DrawerDisplay>
    </>
  );
};

export default Drawer;
