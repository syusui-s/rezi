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
      <button style="bg-zinc-100" onClick={() => setOpen(true)}>
        {props.buttonContent}
      </button>
      <DrawerDisplay open={open()} onClose={() => setOpen(false)}>
        {props.children}
      </DrawerDisplay>
    </>
  );
};

export default Drawer;
