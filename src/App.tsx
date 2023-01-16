import type { Component } from 'solid-js';
import { Routes, Route, Navigate } from '@solidjs/router';

import CatalogList from '@/pages/CatalogList';
import CatalogEdit from '@/pages/CatalogEdit';
import ProductList from '@/pages/ProductList';
import ProductView from '@/pages/ProductView';
import SaleList from '@/pages/SaleList';
import NotFound from '@/pages/NotFound';
import About from '@/pages/About';

const App: Component = () => (
  <Routes>
    <Route path="/catalogs" element={<CatalogList />} />
    <Route path="/catalogs/new" element={<CatalogEdit />} />
    <Route path="/catalogs/:catalogId/products" element={<ProductList />} />
    <Route path="/catalogs/:catalogId/products/new" element={<ProductView />} />
    <Route path="/catalogs/:catalogId/products/:productId" element={<ProductView />} />
    <Route path="/catalogs/:catalogId" element={<CatalogEdit />} />
    <Route path="/sales" element={<SaleList />} />
    <Route path="/about" element={<About />} />
    <Route path="/" element={<Navigate href="/catalogs" />} />
    <Route path="/*" element={<NotFound />} />
  </Routes>
);

export default App;
