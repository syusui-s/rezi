import type { Component } from 'solid-js';
import { Routes, Route, Navigate } from 'solid-app-router';

import Catalog from '@/pages/Catalog';
import ManageProduct from '@/pages/ManageProduct';
import NotFound from '@/pages/NotFound';

const App: Component = () => (
  <Routes>
    <Route path="/catalog" element={<Catalog />} />
    <Route path="/products/new" element={<ManageProduct />} />
    <Route path="/" element={<Navigate href="/catalog" />} />
    <Route path="/*" element={<NotFound />} />
  </Routes>
);

export default App;
