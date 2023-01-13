import type { Component, JSX } from 'solid-js';

export type AppLayoutProps = {
  titleElement?: JSX.Element;
  prevElement?: JSX.Element;
  nextElement?: JSX.Element;
  children?: JSX.Element;
};

const AppLayout: Component<AppLayoutProps> = (props) => {
  return (
    <div>
      <div class="sticky top-0 z-50 mb-4 h-10 w-full bg-white shadow md:h-14">
        <div class="container mx-auto flex h-full items-center justify-between xl:w-8/12">
          <div class="flex basis-1/3 justify-start px-2">{props.prevElement}</div>
          <div class="grow text-center text-xl font-bold">{props.titleElement}</div>
          <div class="flex basis-1/3 justify-end px-2">{props.nextElement}</div>
        </div>
      </div>
      <div class="container mx-auto xl:w-8/12">{props.children}</div>
    </div>
  );
};

export default AppLayout;
