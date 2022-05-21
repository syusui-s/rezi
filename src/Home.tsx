import type { Component } from 'solid-js';
import { Link } from 'solid-app-router';

import AppLayout from './components/AppLayout';

const Home: Component = () => (
  <AppLayout title="ホーム">
    <ul class="flex flex-col list-disc">
      <li>
        <Link href="/catalog" class="text-blue-500 underline">
          カタログ
        </Link>
      </li>
      <li>
        <Link href="/products/new" class="text-blue-500 underline">
          頒布物追加
        </Link>
      </li>
    </ul>
  </AppLayout>
);

export default Home;
