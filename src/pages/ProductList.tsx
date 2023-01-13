import { For, Show, createSignal, createMemo } from 'solid-js';
import type { Component, JSX } from 'solid-js';
import { Link, useNavigate, useParams } from '@solidjs/router';

import AppLayout from '@/components/AppLayout';
import PriceDisplay from '@/components/PriceDisplay';
import ProductCover from '@/components/ProductCover';
import QuantityDisplay from '@/components/QuantityDisplay';
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
    class="h-6 w-6"
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
    if (window.confirm('本当に削除しますか？')) {
      props.removeProduct(props.product.id);
    }
  };

  return (
    <div
      class="cursor-pointer touch-manipulation select-none rounded border-2 border-white bg-white p-2 shadow-md hover:bg-zinc-50 md:px-4"
      classList={{ 'border-zinc-200': props.quantity > 0 }}
      role="button"
      tabIndex="0"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div class="relative aspect-square bg-zinc-200 object-cover">
        <Show when={!props.editing}>
          <QuantityDisplay quantity={props.quantity} />
        </Show>
        <ProductCover product={props.product} />
      </div>
      <div class="overflow-hidden text-ellipsis whitespace-nowrap text-xs md:text-base">
        {props.product.name}
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div class="text-base font-bold leading-5 sm:text-lg">
          <PriceDisplay price={props.product.price} />
        </div>
        <div class="text-xs leading-3 sm:text-base">↑ {props.saleStat?.totalCount ?? 0}</div>
      </div>
      <Show when={props.editing}>
        <div>
          <button
            type="button"
            onClick={handleRemove}
            area-label="削除"
            class="text-xs text-red-500 md:text-base"
          >
            削除
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
      class="flex h-8 items-center border-b"
      classList={{ 'text-zinc-300': props.cartItem.quantity === 0 }}
    >
      <div class="w-full flex-auto overflow-hidden text-ellipsis whitespace-nowrap px-2 text-lg">
        {props.product.name}
      </div>
      <div class="text-base">
        <PriceDisplay price={props.product.price} />
      </div>
      <div class="flex items-center">
        <div class="mx-4 w-8 text-center font-mono text-2xl font-bold">
          {props.cartItem.quantity}
        </div>
        <button
          class="h-full w-12 touch-manipulation select-none py-1 font-mono text-xl hover:bg-zinc-100 focus:bg-zinc-200"
          onClick={() => props.removeFromCart(props.cartItem.productId)}
        >
          -
        </button>
        <button
          class="h-full w-12 touch-manipulation select-none py-1 font-mono text-xl hover:bg-zinc-100 focus:bg-zinc-200"
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

  const cartDisplay = () => {
    const [showComplete, setShowComplete] = createSignal(false);

    return (
      <Show when={!editing() && getCatalog() != null}>
        <div
          class="container fixed top-0 z-10 mt-10 flex h-60 w-full flex-col bg-white p-2 md:top-auto md:bottom-0 md:h-56 md:flex-row md:items-center md:justify-between md:px-0 xl:w-8/12"
          style={{ 'box-shadow': '0 2px 10px rgba(0,0,0,0.2)', 'max-height': '40vh' }}
        >
          <div class="h-full touch-pan-y overflow-y-scroll border-b md:basis-2/3 md:border-r">
            <For each={cart().content()}>
              {(cartItem: CartItem) => (
                <Show<Product> when={getProduct(cartItem.productId)}>
                  {(product: Product) => (
                    <CartItemDisplay
                      product={product}
                      cartItem={cartItem}
                      addToCart={addToCart}
                      removeFromCart={removeFromCart}
                    />
                  )}
                </Show>
              )}
            </For>
          </div>
          <div class="flex flex-auto flex-col items-end justify-end md:h-full md:px-2">
            <div class="flex items-center gap-4 py-2 md:flex-col md:items-end md:gap-0">
              <div class="text-base text-zinc-700 md:text-2xl">{totalQuantity()} 点</div>
              <div class="text-right text-3xl md:text-5xl">
                <PriceDisplay price={totalPrice()} />
              </div>
            </div>
            <div class="flex h-12 w-full items-center justify-between gap-2 sm:h-16">
              <button
                type="button"
                class="h-full w-16 touch-manipulation bg-zinc-500 text-base text-white shadow hover:bg-zinc-600 sm:p-2"
                onClick={() => clearCart()}
              >
                クリア
              </button>
              <button
                type="button"
                class="h-full w-32 touch-manipulation bg-blue-500 text-xl text-white shadow hover:bg-blue-700 disabled:bg-blue-800 disabled:text-zinc-400 sm:p-2 md:text-2xl"
                disabled={cart().isEmpty() || showComplete()}
                onClick={() => {
                  handleRegister();
                  setShowComplete(true);
                  setTimeout(() => setShowComplete(false), 500);
                }}
              >
                <Show when={showComplete()} fallback="会計">
                  ✓
                </Show>
              </button>
            </div>
          </div>
        </div>
      </Show>
    );
  };

  const productsDisplay = (
    <div class="my-4 grid touch-pan-y grid-cols-4 gap-2 md:grid-cols-5 md:gap-4">
      <For
        each={getCatalog()?.getProductArray() ?? []}
        fallback={<div>頒布物がまだ登録されていません</div>}
      >
        {(product: Product) => {
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
        }}
      </For>
    </div>
  );

  return (
    <Show when={getCatalog() != null} fallback={<NotFound />}>
      <AppLayout
        titleElement={getCatalog()?.name ?? ''}
        prevElement={
          <Link href="/catalogs/" class="navigationButton">
            ←
          </Link>
        }
        nextElement={
          <Show
            when={editing()}
            fallback={
              <button class="navigationButton" onClick={() => setEditing(true)}>
                編集
              </button>
            }
          >
            <div class="flex flex-row items-center gap-4">
              <Link href={`/catalogs/${catalogId()}/products/new`} class="navigationButton">
                <AddItemIcon />
              </Link>
              <button class="navigationButton" onClick={() => setEditing(false)}>
                完了
              </button>
            </div>
          </Show>
        }
      >
        <div class="pt-52 pb-56 md:pt-0 md:pb-56" classList={{ 'pt-0': editing() }}>
          {cartDisplay()}
          {productsDisplay}
        </div>
      </AppLayout>
    </Show>
  );
};

export default CatalogView;
