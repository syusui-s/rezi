import type { Component, JSX } from 'solid-js';
import { Link } from 'solid-app-router';

import Drawer from '@/components/Drawer';

/*
 * MenuIcon is from heroicons.
 * Copyright (c) 2020 Refactoring UI Inc.
 */
const MenuIcon: Component = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const LinkContent: Component<{ children?: JSX.Element }> = (props) => (
  <span class="block py-8 px-4 text-xl font-bold hover:bg-zinc-100">{props.children}</span>
);

const NavigationDrawer: Component = () => {
  return (
    <Drawer buttonStyle="hover:bg-zinc-100" buttonContent={<MenuIcon />}>
      <ul>
        <li>
          <Link href="/catalogs">
            <LinkContent>カタログ一覧</LinkContent>
          </Link>
        </li>
        <li>
          <Link href="/sales">
            <LinkContent>頒布履歴</LinkContent>
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
