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
      <div class="sticky top-0 z-50 mb-4 w-full h-10 bg-white shadow">
        <div class="container flex justify-between items-center mx-auto h-full xl:w-8/12">
          <div class="flex basis-1/3 justify-start px-2">{props.prevElement}</div>
          <div class="grow text-xl font-bold text-center">{props.titleElement}</div>
          <div class="flex basis-1/3 justify-end px-2">{props.nextElement}</div>
        </div>
      </div>
      <div class="container mx-auto xl:w-8/12">{props.children}</div>
    </div>
  );
};

export default AppLayout;
