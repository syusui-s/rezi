import { For, Show } from 'solid-js';
import type { Accessor, Component } from 'solid-js';
import { Link } from 'solid-app-router';

import AppLayout from '@/components/AppLayout';
import PriceDisplay from '@/components/PriceDisplay';
import useCart from '@/useCart';
import useProducts from '@/useProducts';
import useSales from '@/useSales';

const QuantityCubes: Component<{ quantity: Accessor<number> }> = (props) => (
  <div class="grid grid-cols-5 gap-1 sm:gap-2 lg:w-32 w-22">
    <For each={Array(props.quantity()).splice(0, 10)}>
      {() => (
        <div
          class="w-3 h-3 bg-white md:w-4 md:h-4"
          style="box-shadow: 2px 2px 2px rgba(0,0,0,0.7)"
        />
      )}
    </For>
  </div>
);

const CatalogView: Component = () => {
  const { products, findProduct, removeProduct } = useProducts();
  const { cart, addToCart, removeFromCart, clearCart, totalPrice, totalQuantity } = useCart({
    products,
  });
  const { register } = useSales();

  const handleRegister = () => {
    register(cart());
    clearCart();
  };

  return (
    <AppLayout
      titleElement="カタログ ▼"
      prevElement={
        <Link href="/sales" class="navigationButton">
          売上記録
        </Link>
      }
      nextElement={
        <Link href="/products/new" class="navigationButton">
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
        </Link>
      }
    >
      <div class="pt-52 md:pt-0 md:pb-56">
        <div
          class="container flex fixed top-0 z-10
                flex-col p-2 mt-10
                w-full h-60 bg-white
                md:top-auto md:bottom-0 md:flex-row md:justify-between md:items-center md:px-0 md:h-56 xl:w-8/12"
          style="box-shadow: 0 2px 10px rgba(0,0,0,0.2); max-height: 40vh;"
        >
          <div class="overflow-y-scroll flex-auto h-full border-b touch-pan-y md:border-r">
            <For each={cart().content()}>
              {(cartItem) => {
                const product = findProduct(cartItem.productId);

                if (product == null) return null;

                return (
                  <div
                    class="flex items-center pr-2 h-8 border-b"
                    classList={{ 'text-zinc-300': cartItem.quantity === 0 }}
                  >
                    <div class="overflow-hidden flex-auto w-full text-lg text-ellipsis whitespace-nowrap">
                      {product.name}
                    </div>
                    <div class="text-base">
                      <PriceDisplay price={() => product.price} />
                    </div>
                    <div class="flex items-center">
                      <div class="mx-4 w-8 text-2xl font-bold text-center text-mono">
                        {cartItem.quantity}
                      </div>
                      <button
                        class="py-1 w-12 h-full text-xl hover:bg-zinc-100 focus:bg-zinc-200 touch-manipulation select-none text-mono"
                        onClick={() => removeFromCart(cartItem.productId)}
                      >
                        -
                      </button>
                      <button
                        class="py-1 w-12 h-full text-xl hover:bg-zinc-100 focus:bg-zinc-200 touch-manipulation select-none text-mono"
                        onClick={() => addToCart(cartItem.productId)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
          <div class="flex flex-col justify-end items-end md:basis-1/3 md:px-2 md:h-full">
            <div class="flex gap-4 items-center py-2 md:flex-col md:gap-0 md:items-end">
              <div class="text-base text-zinc-700 md:text-2xl">{totalQuantity()} 点</div>
              <div class="text-3xl md:text-5xl text-end">
                <PriceDisplay price={totalPrice} />
              </div>
            </div>
            <div class="flex gap-2 justify-between items-center w-full h-9 sm:h-12">
              <button
                type="button"
                class="w-16 h-full text-base text-white bg-zinc-500 hover:bg-zinc-600 shadow touch-manipulation sm:p-2"
                onClick={() => {
                  clearCart();
                }}
              >
                クリア
              </button>
              <button
                type="button"
                class="w-32 h-full text-lg text-white disabled:text-zinc-400 bg-blue-500 hover:bg-blue-700 disabled:bg-blue-800 shadow touch-manipulation sm:p-2 md:text-2xl"
                disabled={cart().isEmpty()}
                onClick={handleRegister}
              >
                会計
              </button>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-4 gap-2 my-4 touch-pan-y md:grid-cols-5 md:gap-4">
          <For each={products()} fallback={<div>頒布物がまだ登録されていません</div>}>
            {(product) => {
              const quantity = () => cart().find(product.id)?.quantity ?? 0;
              return (
                <div
                  class="p-2 py-2 bg-white hover:bg-zinc-50 rounded shadow-md cursor-pointer touch-manipulation select-none md:px-4"
                  role="button"
                  tabIndex="0"
                  onClick={() => addToCart(product.id)}
                  onKeyDown={(ev) => ev.key === 'Enter' && addToCart(product.id)}
                >
                  <div class="aspect-square object-cover relative bg-zinc-200">
                    <Show when={quantity() > 0}>
                      <div
                        class="flex absolute flex-col flex-nowrap justify-center items-center w-full h-full"
                        style="background: rgba(0,0,0,0.4)"
                      >
                        <div
                          class="font-mono text-4xl font-bold text-white sm:text-5xl md:text-6xl"
                          style="text-shadow: 1px 1px 4px #000"
                        >
                          {quantity()}
                        </div>
                        <QuantityCubes quantity={quantity} />
                      </div>
                    </Show>
                    <Show when={product.imageUrl == null}>
                      <div class="overflow-hidden p-2 mx-auto w-full h-full text-lg text-white whitespace-pre break-all bg-blue-500 sm:text-xl md:p-4 md:text-2xl">
                        {product.name}
                      </div>
                    </Show>
                    <Show when={product.imageUrl != null}>
                      <div class="flex justify-center w-full h-full">
                        <img
                          src={product.imageUrl}
                          class="object-contain max-w-full max-h-full"
                          alt="頒布物の画像"
                        />
                      </div>
                    </Show>
                  </div>
                  <div class="overflow-hidden text-xs text-ellipsis whitespace-nowrap md:text-base">
                    {product.name}
                  </div>
                  <div class="font-mono text-base font-bold">
                    <PriceDisplay price={() => product.price} />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      area-label="削除"
                      class="text-xs text-red-500 md:text-base"
                    >
                      削除
                    </button>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </AppLayout>
  );
};

export default CatalogView;
