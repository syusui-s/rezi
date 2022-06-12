import { createSignal, Component, JSX } from 'solid-js';

import DrawerDisplay from '@/components/DrawerDisplay';

export type DrawerProps = {
  buttonContent: JSX.Element;
  children: JSX.Element;
};

const Drawer: Component<DrawerProps> = (props) => {
  const [open, setOpen] = createSignal(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>{props.buttonContent}</button>
      <DrawerDisplay open={open()} onClose={() => setOpen(false)}>
        {props.children}
      </DrawerDisplay>
    </>
  );
};

export default Drawer;
