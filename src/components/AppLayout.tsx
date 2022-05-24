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
      <div class="w-full h-10 mb-4 shadow bg-white sticky top-0 z-50">
        <div class="flex items-center justify-between container xl:w-8/12 mx-auto h-full">
          <div class="basis-1/3 flex justify-start px-2">{props.prevElement}</div>
          <div class="grow text-center text-xl font-bold">{props.titleElement}</div>
          <div class="basis-1/3 flex justify-end px-2">{props.nextElement}</div>
        </div>
      </div>
      <div class="container xl:w-8/12 mx-auto">{props.children}</div>
    </div>
  );
};

export default AppLayout;
