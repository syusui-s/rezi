import { For, Show, createSignal, createMemo } from 'solid-js';
import type { Component, JSX } from 'solid-js';
import { Link, useNavigate, useParams } from 'solid-app-router';

import AppLayout from '@/components/AppLayout';
import PriceDisplay from '@/components/PriceDisplay';
import ProductCover from '@/components/ProductCover';
import type Product from '@/models/Product';
import CartItem from '@/models/CartItem';
import { statSalesByProduct } from '@/models/SaleStat';
import type { SaleStat } from '@/models/SaleStat';
import NotFound from '@/pages/NotFound';
import useCart from '@/useCart';
import useCatalogs from '@/useCatalogs';
import useSales from '@/useSales';

/*
 * AddItemIcon is from heroicons.
 * Copyright (c) 2020 Refactoring UI Inc.
 */
const AddItemIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="w-6 h-6"
    fill="none"
    view-box="0 0 24 24"
    stroke="currentColor"
    stroke-width={2}
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
    />
  </svg>
);

const QuantityCubes: Component<{ quantity: number }> = (props) => (
  <div class="grid grid-cols-5 gap-1 w-20 sm:gap-2 lg:w-32">
    <For each={Array(props.quantity).splice(0, 10)}>
      {() => (
        <div
          class="w-3 h-3 bg-white md:w-4 md:h-4"
          style="box-shadow: 2px 2px 2px rgba(0,0,0,0.7)"
        />
      )}
    </For>
  </div>
);

type ProductDisplayProps = {
  catalogId: string | undefined;
  product: Product;
  saleStat?: SaleStat;
  quantity: number;
  addToCart: (productId: string) => void;
  removeProduct: (productId: string) => void;
  editing: boolean;
};

const ProductDisplay: Component<ProductDisplayProps> = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (props.editing) {
      if (props.catalogId == null) return;
      const escapedCatalogId = encodeURIComponent(props.catalogId);
      const escapedProductId = encodeURIComponent(props.product.id);
      navigate(`/catalogs/${escapedCatalogId}/products/${escapedProductId}`);
    } else {
      props.addToCart(props.product.id);
    }
  };

  const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (ev) =>
    ev.key === 'Enter' && handleClick();

  const handleRemove: JSX.EventHandler<HTMLButtonElement, Event> = (ev) => {
    ev.stopPropagation();
    // eslint-disable-next-line no-alert
    if (window.confirm('??????????????????????????????')) {
      props.removeProduct(props.product.id);
    }
  };

  const quantityDisplay = (
    <Show when={props.quantity > 0}>
      <div
        class="flex absolute flex-col flex-nowrap justify-center items-center w-full h-full"
        style="background: rgba(0,0,0,0.4)"
      >
        <Show
          when={props.quantity <= 10}
          fallback={
            <div
              class="font-mono text-4xl font-bold text-white sm:text-5xl md:text-6xl"
              style="text-shadow: 1px 1px 4px #000"
            >
              {props.quantity}
            </div>
          }
        >
          <QuantityCubes quantity={props.quantity} />
        </Show>
      </div>
    </Show>
  );

  return (
    <div
      class="p-2 bg-white hover:bg-zinc-50 rounded border-2 border-white shadow-md cursor-pointer touch-manipulation select-none md:px-4"
      classList={{ 'border-zinc-200': props.quantity > 0 }}
      role="button"
      tabIndex="0"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div class="aspect-square object-cover relative bg-zinc-200">
        <Show when={!props.editing}>{quantityDisplay}</Show>
        <ProductCover product={props.product} />
      </div>
      <div class="overflow-hidden text-xs text-ellipsis whitespace-nowrap md:text-base">
        {props.product.name}
      </div>
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div class="text-base font-bold leading-5 sm:text-lg">
          <PriceDisplay price={props.product.price} />
        </div>
        <div class="text-xs leading-3 sm:text-base">??? {props.saleStat?.totalCount ?? 0}</div>
      </div>
      <Show when={props.editing}>
        <div>
          <button
            type="button"
            onClick={handleRemove}
            area-label="??????"
            class="text-xs text-red-500 md:text-base"
          >
            ??????
          </button>
        </div>
      </Show>
    </div>
  );
};

type CartItemDisplayProps = {
  product: Product;
  cartItem: CartItem;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
};

const CartItemDisplay: Component<CartItemDisplayProps> = (props) => {
  return (
    <div
      class="flex items-center h-8 border-b"
      classList={{ 'text-zinc-300': props.cartItem.quantity === 0 }}
    >
      <div class="overflow-hidden flex-auto px-2 w-full text-lg text-ellipsis whitespace-nowrap">
        {props.product.name}
      </div>
      <div class="text-base">
        <PriceDisplay price={props.product.price} />
      </div>
      <div class="flex items-center">
        <div class="mx-4 w-8 font-mono text-2xl font-bold text-center">
          {props.cartItem.quantity}
        </div>
        <button
          class="py-1 w-12 h-full font-mono text-xl hover:bg-zinc-100 focus:bg-zinc-200 touch-manipulation select-none"
          onClick={() => props.removeFromCart(props.cartItem.productId)}
        >
          -
        </button>
        <button
          class="py-1 w-12 h-full font-mono text-xl hover:bg-zinc-100 focus:bg-zinc-200 touch-manipulation select-none"
          onClick={() => props.addToCart(props.cartItem.productId)}
        >
          +
        </button>
      </div>
    </div>
  );
};

const CatalogView: Component = () => {
  const params = useParams();

  const catalogId = () => params.id;

  const [editing, setEditing] = createSignal(false);
  const { findCatalog, findProduct, removeProduct } = useCatalogs();

  const getCatalog = () => {
    const id = catalogId();
    return id ? findCatalog(id) : undefined;
  };

  const getProduct = (productId: string) => {
    const catalog = getCatalog();
    return catalog && findProduct(catalog.id, productId);
  };

  const { cart, addToCart, removeFromCart, clearCart, totalPrice, totalQuantity } = useCart({
    products: () => getCatalog()?.getProductArray() ?? [],
  });
  const { sales, register } = useSales();
  const saleStats = createMemo(() => statSalesByProduct(sales()));

  const handleRegister = () => {
    const catalog = getCatalog();
    if (catalog == null) return;
    register(catalog, cart());
    clearCart();
  };

  const cartItemDisplay = (cartItem: CartItem) => (
    <Show when={getProduct(cartItem.productId)}>
      {(product) => (
        <CartItemDisplay
          product={product}
          cartItem={cartItem}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      )}
    </Show>
  );

  const cartDisplay = (
    <Show when={!editing() && getCatalog() != null}>
      <div
        class="container flex fixed top-0 z-10 flex-col p-2 mt-10 w-full h-60 bg-white md:top-auto md:bottom-0 md:flex-row md:justify-between md:items-center md:px-0 md:h-56 xl:w-8/12"
        style="box-shadow: 0 2px 10px rgba(0,0,0,0.2); max-height: 40vh;"
      >
        <div class="overflow-y-scroll h-full border-b touch-pan-y md:basis-2/3 md:border-r">
          <For each={cart().content()}>{cartItemDisplay}</For>
        </div>
        <div class="flex flex-col flex-auto justify-end items-end md:px-2 md:h-full">
          <div class="flex gap-4 items-center py-2 md:flex-col md:gap-0 md:items-end">
            <div class="text-base text-zinc-700 md:text-2xl">{totalQuantity()} ???</div>
            <div class="text-3xl text-right md:text-5xl">
              <PriceDisplay price={totalPrice()} />
            </div>
          </div>
          <div class="flex gap-2 justify-between items-center w-full h-9 sm:h-12">
            <button
              type="button"
              class="w-16 h-full text-base text-white bg-zinc-500 hover:bg-zinc-600 shadow touch-manipulation sm:p-2"
              onClick={() => clearCart()}
            >
              ?????????
            </button>
            <button
              type="button"
              class="w-32 h-full text-lg text-white disabled:text-zinc-400 bg-blue-500 hover:bg-blue-700 disabled:bg-blue-800 shadow touch-manipulation sm:p-2 md:text-2xl"
              disabled={cart().isEmpty()}
              onClick={handleRegister}
            >
              ??????
            </button>
          </div>
        </div>
      </div>
    </Show>
  );

  const productDisplay = (product: Product) => {
    const saleStat = () => saleStats().get(product.id);
    return (
      <ProductDisplay
        catalogId={catalogId()}
        product={product}
        saleStat={saleStat()}
        quantity={cart().find(product.id)?.quantity ?? 0}
        addToCart={addToCart}
        removeProduct={(productId) => {
          const catalog = getCatalog();
          if (catalog == null) return;
          removeProduct(catalog.id, productId);
        }}
        editing={editing()}
      />
    );
  };

  const productsDisplay = (
    <div class="grid grid-cols-4 gap-2 my-4 touch-pan-y md:grid-cols-5 md:gap-4">
      <For
        each={getCatalog()?.getProductArray() ?? []}
        fallback={<div>?????????????????????????????????????????????</div>}
      >
        {productDisplay}
      </For>
    </div>
  );

  return (
    <Show when={getCatalog() != null} fallback={<NotFound />}>
      <AppLayout
        titleElement={getCatalog()?.name ?? ''}
        prevElement={
          <Link href="/catalogs/" class="navigationButton">
            ???
          </Link>
        }
        nextElement={
          <Show
            when={editing()}
            fallback={
              <button class="navigationButton" onClick={() => setEditing(true)}>
                ??????
              </button>
            }
          >
            <div class="flex flex-row gap-4 items-center">
              <Link href={`/catalogs/${catalogId()}/products/new`} class="navigationButton">
                <AddItemIcon />
              </Link>
              <button class="navigationButton" onClick={() => setEditing(false)}>
                ??????
              </button>
            </div>
          </Show>
        }
      >
        <div class="pt-52 pb-56 md:pt-0 md:pb-56" classList={{ 'pt-0': editing() }}>
          {cartDisplay}
          {productsDisplay}
        </div>
      </AppLayout>
    </Show>
  );
};

export default CatalogView;
