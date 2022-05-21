import type { Component, JSX } from 'solid-js';

export type AppLayoutProps = {
  title: string;
  prevElement?: JSX.Element;
  nextElement?: JSX.Element;
  children?: JSX.Element;
};

const AppLayout: Component<AppLayoutProps> = (props) => {
  return (
    <div>
      <div class="w-full h-12 mb-4 shadow bg-white sticky top-0 z-10">
        <div class="flex items-center justify-between container xl:w-8/12 mx-auto h-full">
          <div class="basis-1/3 text-left px-2">{props.prevElement}</div>
          <div class="grow text-center text-2xl font-bold">{props.title}</div>
          <div class="basis-1/3 text-right px-2">{props.nextElement}</div>
        </div>
      </div>
      <div class="container xl:w-8/12 mx-auto">{props.children}</div>
    </div>
  );
};

export default AppLayout;
