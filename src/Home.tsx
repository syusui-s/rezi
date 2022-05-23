import type { Component } from 'solid-js';
import { Link } from 'solid-app-router';

import AppLayout from './components/AppLayout';

const Home: Component = () => (
  <AppLayout titleElement="ホーム">
    <ul class="flex flex-col list-disc">
      <li>
        <Link href="/catalog" class="text-blue-500 underline">
          カタログ
        </Link>
      </li>
      <li>
        <Link href="/" class="text-blue-500 underline">
          売上記録
        </Link>
      </li>
    </ul>
  </AppLayout>
);

export default Home;
