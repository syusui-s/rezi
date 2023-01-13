import { Show } from 'solid-js';
import type { Component, JSX } from 'solid-js';
import { Link } from '@solidjs/router';

import Drawer from '@/components/Drawer';

/*
 * MenuIcon is from heroicons.
 * Copyright (c) 2020 Refactoring UI Inc.
 */
const MenuIcon: Component = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const ViewGridIcon: Component = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

const ChartBarIcon: Component = () => (
  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
);

const LinkContent: Component<{ icon?: JSX.Element; children?: JSX.Element }> = (props) => (
  <div class="flex flex-row items-center p-4 text-xl font-bold hover:bg-zinc-100 active:bg-zinc-200">
    <Show when={props.icon != null}>
      <div class="mr-4">{props.icon}</div>
    </Show>
    {props.children}
  </div>
);

const NavigationDrawer: Component = () => {
  return (
    <Drawer buttonStyle="hover:bg-zinc-100" buttonContent={<MenuIcon />}>
      <ul>
        <li>
          <Link href="/catalogs">
            <LinkContent icon={<ViewGridIcon />}>カタログ一覧</LinkContent>
          </Link>
        </li>
        <li>
          <Link href="/sales">
            <LinkContent icon={<ChartBarIcon />}>頒布記録</LinkContent>
          </Link>
        </li>
        <li>
          <Link href="/about">
            <LinkContent>このアプリについて</LinkContent>
          </Link>
        </li>
      </ul>
    </Drawer>
  );
};

export default NavigationDrawer;
