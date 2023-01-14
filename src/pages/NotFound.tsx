import type { Component } from 'solid-js';
import { Link } from '@solidjs/router';

import AppLayout from '@/components/AppLayout';

const NotFound: Component = () => (
  <AppLayout titleElement="Not Found">
    <Link href="/" class="text-2xl text-blue-500 underline">
      ← Back to home
    </Link>
  </AppLayout>
);

export default NotFound;
