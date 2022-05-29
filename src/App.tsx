import type { Component } from 'solid-js';
import { Routes, Route, Navigate } from 'solid-app-router';

import CatalogView from '@/pages/CatalogView';
import ProductView from '@/pages/ProductView';
import SaleList from '@/pages/SaleList';
import NotFound from '@/pages/NotFound';
import About from '@/pages/About';

const App: Component = () => (
  <Routes>
    <Route path="/catalogs/current" element={<CatalogView />} />
    <Route path="/products/new" element={<ProductView />} />
    <Route path="/products/:id" element={<ProductView />} />
    <Route path="/sales" element={<SaleList />} />
    <Route path="/about" element={<About />} />
    <Route path="/" element={<Navigate href="/catalogs/current" />} />
    <Route path="/*" element={<NotFound />} />
  </Routes>
);

export default App;
