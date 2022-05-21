import type { Component } from 'solid-js';
import { Routes, Route } from 'solid-app-router';

import Home from './Home';
import Catalog from './Catalog';
import ManageProduct from './ManageProduct';

const App: Component = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/catalog" element={<Catalog />} />
    <Route path="/products/new" element={<ManageProduct />} />
  </Routes>
);

export default App;
