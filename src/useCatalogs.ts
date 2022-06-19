import { createSignal, createEffect, onMount } from 'solid-js';
import type { Accessor } from 'solid-js';

import Catalog from '@/models/Catalog';
import Product from '@/models/Product';
import generateId from '@/utils/generateId';
import { serializeCatalogs, deserializeCatalogs } from './serialize/catalog';

export type UseCatalogs = {
  catalogs: Accessor<Record<string, Catalog>>;
  findCatalog: (catalogId: string) => Catalog | undefined;
  saveCatalog: (catalog: Catalog) => void;
  removeCatalog: (catalogId: string) => void;
  saveProduct: (catalogId: string, product: Product) => void;
  removeProduct: (catalogId: string, productId: string) => void;
  findProduct: (catalogId: string, productId: string) => Product | undefined;
};

const defaultCatalogId = generateId();
const defaultCatalogs = { [defaultCatalogId]: new Catalog(defaultCatalogId, 'カタログ', {}) };

const useCatalogs = (): UseCatalogs => {
  const [loaded, setLoaded] = createSignal<boolean>(false);
  const [catalogs, setCatalogs] = createSignal<Record<string, Catalog>>(defaultCatalogs);

  onMount(() => {
    const lastCatalogs = globalThis.localStorage.getItem('catalogs');

    if (lastCatalogs === null) {
      setLoaded(true);
      return;
    }

    const deserialized = deserializeCatalogs(lastCatalogs);
    if (deserialized != null) {
      setCatalogs(deserialized);
    }
    setLoaded(true);
  });

  createEffect(() => {
    if (loaded()) {
      window.localStorage.setItem('catalogs', serializeCatalogs(catalogs()));
    }
  });

  const findCatalog = (catalogId: string): Catalog | undefined => {
    return catalogs()[catalogId];
  };

  const saveCatalog = (catalog: Catalog) => {
    const newCatalogs = { ...catalogs() };
    newCatalogs[catalog.id] = catalog;
    setCatalogs(newCatalogs);
  };

  const updateCatalog = (catalogId: string, f: (catalog: Catalog) => Catalog) => {
    const catalog = findCatalog(catalogId);
    if (catalog == null) return;
    saveCatalog(f(catalog));
  };

  const removeCatalog = (catalogId: string) => {
    const newCatalogs = { ...catalogs() };
    delete newCatalogs[catalogId];
    setCatalogs(newCatalogs);
  };

  const saveProduct = (catalogId: string, product: Product) => {
    updateCatalog(catalogId, (catalog) => catalog.saveProduct(product));
  };

  const removeProduct = (catalogId: string, productId: string) => {
    updateCatalog(catalogId, (catalog) => catalog.removeProduct(productId));
  };

  const findProduct = (catalogId: string, productId: string): Product | undefined =>
    catalogs()[catalogId]?.findProduct(productId);

  return {
    catalogs,
    findCatalog,
    saveCatalog,
    removeCatalog,
    saveProduct,
    removeProduct,
    findProduct,
  };
};

export default useCatalogs;
