import { createSignal, For, Show } from 'solid-js';
import type { Accessor, Component } from 'solid-js';
import { Link } from 'solid-app-router';

import AppLayout from '@/components/AppLayout';
import useCart from '@/useCart';
import useProducts from '@/useProducts';
import commafy from '@/utils/commafy';

const PriceDisplay: Component<{ price: Accessor<number> }> = (props) => (
  <span class="font-mono">&yen;{commafy(props.price())}</span>
);

const QuantityCubes: Component<{ quantity: Accessor<number> }> = (props) => (
  <div class="grid grid-cols-5 w-22 lg:w-32 gap-1 sm:gap-2">
    <For each={Array(props.quantity()).splice(0, 10)}>
      {() => (
        <div
          class="w-3 h-3 md:w-4 md:h-4 bg-white"
          style="box-shadow: 2px 2px 2px rgba(0,0,0,0.7)"
        />
      )}
    </For>
  </div>
);

const Catalog: Component = () => {
  const [showCart, setShowCart] = createSignal(false);
  const { products, addProduct, removeProduct } = useProducts();
  const { cart, addToCart, removeFromCart, clearCart, totalPrice, totalQuantity } = useCart({
    products,
  });

  return (
    <AppLayout
      titleElement="カタログ ▼"
      nextElement={
        <Link href="/products/new" class="navigationButton">
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
        </Link>
      }
    >
      <div class="pt-52 md:pt-0 md:pb-56">
        <div
          class="bg-white container w-full xl:w-8/12 fixed
                top-0 z-10 h-60
                md:h-56 md:top-auto md:bottom-0
                flex flex-col md:flex-row md:items-center md:justify-between p-2 md:px-0 mt-10"
          style="box-shadow: 0 2px 10px rgba(0,0,0,0.2); max-height: 40vh;"
        >
          <div class="flex-auto overflow-y-scroll h-full flex-auto border-b md:border-r">
            <For each={cart().content()}>
              {(cartItem) => {
                const product = products().find((e) => e.id === cartItem.productId);

                if (product == null) return null;

                return (
                  <div class="flex h-8 items-center pr-2 border-b">
                    <div class="flex items-center">
                      <button
                        class="w-12 py-1 h-full text-xl hover:bg-zinc-100 focus:bg-zinc-200 text-mono"
                        onClick={() => removeFromCart(cartItem.productId)}
                      >
                        -
                      </button>
                      <div class="w-8 text-center mx-4 text-mono font-bold text-2xl">
                        {cartItem.quantity}
                      </div>
                      <button
                        class="w-12 py-1 h-full text-xl hover:bg-zinc-100 focus:bg-zinc-200 text-mono"
                        onClick={() => addToCart(cartItem.productId)}
                      >
                        +
                      </button>
                    </div>
                    <div class="flex-auto text-lg whitespace-nowrap overflow-hidden text-ellipsis w-full">
                      {product.name}
                    </div>
                    <div class="text-base">
                      <PriceDisplay price={() => product.price} />
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
          <div class="flex flex-col items-end justify-end md:px-2 md:h-full md:basis-1/3">
            <div class="flex items-center gap-4 md:gap-0 md:flex-col md:items-end py-2">
              <div class="text-lg md:text-2xl text-zinc-700">{totalQuantity()} 点</div>
              <div class="text-xl md:text-5xl text-end">
                <PriceDisplay price={totalPrice} />
              </div>
            </div>
            <div class="flex items-center justify-between gap-2 w-full h-9 sm:h-12">
              <button
                type="button"
                class="bg-zinc-500 hover:bg-zinc-600 text-white text-base w-16 h-full sm:p-2 shadow"
                onClick={() => {
                  clearCart();
                  setShowCart(false);
                }}
              >
                クリア
              </button>
              <button
                type="button"
                class="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-800 disabled:text-zinc-400 text-lg md:text-2xl text-white w-32 h-full sm:p-2 shadow"
                disabled={cart().isEmpty()}
              >
                会計
              </button>
            </div>
          </div>
        </div>
        <div class="my-4 grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-4">
          <For each={products()} fallback={<div>頒布物がまだ登録されていません</div>}>
            {(product) => {
              const quantity = () => cart().find(product.id)?.quantity ?? 0;
              return (
                <div
                  class="bg-white shadow-md p-2 py-2 md:px-4 hover:bg-zinc-50 rounded select-none cursor-pointer"
                  role="button"
                  tabIndex="0"
                  onClick={() => {
                    console.log('clicked');
                    addToCart(product.id);
                  }}
                  onKeyDown={(ev) => ev.key === 'Enter' && addToCart(product.id)}
                >
                  <div class="object-cover relative aspect-square bg-zinc-200">
                    <Show when={quantity() > 0}>
                      <div
                        class="absolute flex flex-nowrap flex-col justify-center items-center w-full h-full"
                        style="background: rgba(0,0,0,0.4)"
                      >
                        <div
                          class="font-mono font-bold text-white text-4xl sm:text-5xl md:text-6xl"
                          style="text-shadow: 1px 1px 4px #000"
                        >
                          {quantity()}
                        </div>
                        <QuantityCubes quantity={quantity} />
                      </div>
                    </Show>
                    <Show when={product.imageUrl == null}>
                      <div class="bg-blue-500 text-lg sm:text-xl md:text-2xl w-full h-full mx-auto p-2 md:p-4 text-white overflow-hidden whitespace-pre break-all">
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
                  <div class="text-xs md:text-base overflow-hidden whitespace-nowrap text-ellipsis">
                    {product.name}
                  </div>
                  <div class="text-base font-bold font-mono">&yen;{commafy(product.price)}</div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      area-label="削除"
                      class="text-red-500 text-xs md:text-base"
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

export default Catalog;
