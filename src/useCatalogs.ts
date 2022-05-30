import { createSignal, createEffect, onMount } from 'solid-js';
import type { Accessor } from 'solid-js';

import Catalog from '@/models/Catalog';
import Product from '@/models/Product';
import generateId from '@/utils/generateId';
import { serializeCatalogs, deserializeCatalogs } from './serialize/catalog';

export type UseCatalogs = {
  catalogs: Accessor<Record<string, Catalog>>;
  currentCatalog: Accessor<Catalog>;
  saveProduct: (catalogId: string, product: Product) => void;
  removeProduct: (catalogId: string, productId: string) => void;
  findProduct: (catalogId: string, productId: string) => Product | undefined;
};

const defaultCatalogId = generateId();
const defaultCatalogs = { [defaultCatalogId]: new Catalog(defaultCatalogId, 'カタログ', {}) };

const useCatalogs = (): UseCatalogs => {
  const [loaded, setLoaded] = createSignal<boolean>(false);
  const [currentCatalogId, setCurrentCatalogId] = createSignal<string>(defaultCatalogId);
  const [catalogs, setCatalogs] = createSignal<Record<string, Catalog>>(defaultCatalogs);

  onMount(() => {
    const lastCatalogs = globalThis.localStorage.getItem('catalogs');
    const lastCurrentCatalogId = globalThis.localStorage.getItem('currentCatalogId');

    if (lastCatalogs === null || lastCurrentCatalogId === null) {
      setLoaded(true);
      return;
    }

    const deserialized = deserializeCatalogs(lastCatalogs);
    if (deserialized != null) {
      setCatalogs(deserialized);
      setCurrentCatalogId(lastCurrentCatalogId);
    }
    setLoaded(true);
  });

  createEffect(() => {
    if (loaded()) {
      window.localStorage.setItem('catalogs', serializeCatalogs(catalogs()));
      window.localStorage.setItem('currentCatalogId', currentCatalogId());
    }
  });

  const currentCatalog = (): Catalog => {
    const found = catalogs()[currentCatalogId()];
    if (!found) throw new Error('');

    return found;
  };

  const updateCatalog = (catalogId: string, f: (catalog: Catalog) => Catalog) => {
    const catalog = catalogs()[catalogId];
    if (catalog == null) return;

    const newCatalogs = { ...catalogs() };
    newCatalogs[catalogId] = f(catalog);
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
    currentCatalog,
    saveProduct,
    removeProduct,
    findProduct,
  };
};

export default useCatalogs;
