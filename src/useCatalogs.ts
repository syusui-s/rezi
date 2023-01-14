import type { Accessor } from 'solid-js';

import Catalog from '@/models/Catalog';
import Product from '@/models/Product';
import generateId from '@/utils/generateId';
import { createStorageWithSerializer, createSignalWithStorage } from '@/createSignalWithStorage';
import { serializeCatalogs, deserializeCatalogs } from './serialize/catalog';

export type UseCatalogs = {
  catalogs: Accessor<Record<string, Catalog>>;
  findCatalog: (catalogId: string) => Catalog | undefined;
  saveCatalog: (catalog: Catalog) => void;
  removeCatalog: (catalogId: string) => void;
  saveProduct: (catalogId: string, product: Product) => void;
  removeProduct: (catalogId: string, productId: string) => void;
  findProduct: (catalogId: string, productId: string) => Product | undefined;
  rearrangeProduct: (catalogId: string, productId: string, insertBeforeId: string) => void;
};

const LOCAL_STORAGE_KEY = 'ReziCatalogs';

const defaultCatalogId = generateId();
const defaultCatalogs = { [defaultCatalogId]: Catalog.create(defaultCatalogId, 'カタログ') };

const catalogsStorage = createStorageWithSerializer<Record<string, Catalog>>(
  () => window.localStorage,
  serializeCatalogs,
  deserializeCatalogs,
);

const useCatalogs = (): UseCatalogs => {
  const [catalogs, setCatalogs] = createSignalWithStorage<Record<string, Catalog>>(
    LOCAL_STORAGE_KEY,
    defaultCatalogs,
    catalogsStorage,
  );

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

  const rearrangeProduct = (catalogId: string, productId: string, insertBeforeId: string) => {
    updateCatalog(catalogId, (catalog) => catalog.rearrangeProduct(productId, insertBeforeId));
  };

  return {
    catalogs,
    findCatalog,
    saveCatalog,
    removeCatalog,
    saveProduct,
    removeProduct,
    findProduct,
    rearrangeProduct,
  };
};

export default useCatalogs;
