import type { Component } from 'solid-js';
import { Routes, Route, Navigate, Link } from 'solid-app-router';

import Catalog from './Catalog';
import ManageProduct from './ManageProduct';

const NotFound: Component = () => (
  <div>
    <h1 class="text-4xl">Not Found</h1>
    <Link href="/" class="text-2xl text-blue-500 underline">
      Home
    </Link>
  </div>
);

const App: Component = () => (
  <Routes>
    <Route path="/catalog" element={<Catalog />} />
    <Route path="/products/new" element={<ManageProduct />} />
    <Route path="/">
      <Navigate href="/catalog" />
    </Route>
    <Route path="/*" element={<NotFound />} />
  </Routes>
);

export default App;
