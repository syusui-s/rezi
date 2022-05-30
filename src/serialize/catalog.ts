import Catalog from '@/models/Catalog';
import Product from '@/models/Product';

type ProductSerialized = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
};

type CatalogSerialized = {
  id: string;
  name: string;
  products: Record<string, ProductSerialized>;
};

export const deserializeCatalogs = (data: string | null): Record<string, Catalog> | null => {
  if (data == null) return null;

  const parsed = JSON.parse(data) as Record<string, CatalogSerialized>;

  return Object.fromEntries(
    Object.entries(parsed).map(
      ([catalogId, rawCatalog]: [string, CatalogSerialized]): [string, Catalog] => {
        const products: [string, Product][] = Object.entries(rawCatalog.products).map(
          ([productId, rawProduct]: [string, ProductSerialized]) => [
            productId,
            new Product(rawProduct.id, rawProduct.name, rawProduct.price, rawProduct.imageUrl),
          ],
        );

        return [
          catalogId,
          new Catalog(rawCatalog.id, rawCatalog.name, Object.fromEntries(products)),
        ];
      },
    ),
  );
};

const serializeProduct = (product: Product): ProductSerialized => ({
  id: product.id,
  name: product.name,
  price: product.price,
  imageUrl: product.imageUrl,
});

const serializeCatalog = (catalog: Catalog): CatalogSerialized => {
  const productsEntries: [string, ProductSerialized][] = Object.entries(catalog.products).map(
    ([productId, product]) => [productId, serializeProduct(product)],
  );

  return {
    id: catalog.id,
    name: catalog.name,
    products: Object.fromEntries(productsEntries),
  };
};

export const serializeCatalogs = (catalogs: Record<string, Catalog>): string => {
  const catalogsEntries: [string, CatalogSerialized][] = Object.entries(catalogs).map(
    ([catalogId, catalog]) => [catalogId, serializeCatalog(catalog)],
  );

  const data: Record<string, CatalogSerialized> = Object.fromEntries(catalogsEntries);

  return JSON.stringify(data);
};
