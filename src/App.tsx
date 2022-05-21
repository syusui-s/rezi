import type { Accessor, Component } from 'solid-js';
import { For, Show } from 'solid-js';

import separateNumber from './utils/separateNumber';
import useCart from './useCart';
import useProducts from './useProducts';
import ProductForm from './components/ProductForm';
import Product from './models/Product';

const PriceDisplay: Component<{ price: Accessor<number> }> = (props) => (
  <span class="font-mono">&yen;{separateNumber(props.price())}</span>
);

const AmountCubes: Component<{ amount: Accessor<number> }> = (props) => (
  <div class="grid grid-cols-5 w-32 gap-2">
    <For each={Array(props.amount()).splice(0, 10)}>
      {() => <div class="w-5 h-5 bg-white" style="box-shadow: 2px 2px 2px rgba(0,0,0,0.7)" />}
    </For>
  </div>
);

const App: Component = () => {
  const { products, addProduct, removeProduct } = useProducts();
  const { cart, addToCart, removeFromCart, clearCart, totalPrice } = useCart({ products });

  const handleProductFormSubmit = ({
    name,
    price,
    imageUrl,
  }: {
    name: string;
    price: number;
    imageUrl?: string;
  }) => {
    const id = Math.random().toString();
    const product = new Product(id, name, price, imageUrl);
    addProduct(product);
  };

  return (
    <div>
      <div class="w-full h-12 mb-4 shadow">
        <div class="flex items-center container xl:w-8/12 mx-auto h-full">
          <div class="basis-1/6 text-center">&lt;</div>
          <div class="flex-1 text-center text-2xl font-bold">頒布物</div>
          <div class="basis-1/6 text-center">&nbsp;</div>
        </div>
      </div>
      <div class="container xl:w-8/12 mx-auto">
        {/*
          <h1 class="text-4xl font-bold">頒布物登録</h1>
          <ProductForm onSubmit={handleProductFormSubmit} />
        */}
        <div class="my-4 grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
          <For each={products()} fallback={<div>頒布物がまだ登録されていません</div>}>
            {(product) => {
              const amount = () => cart().find(product.id)?.amount ?? 0;
              return (
                <div
                  class="bg-white shadow-md py-2 px-4 hover:bg-zinc-50 rounded select-none cursor-pointer"
                  role="button"
                  tabIndex="0"
                  onClick={() => addToCart(product.id)}
                  onKeyDown={(ev) => ev.key === 'Enter' && addToCart(product.id)}
                >
                  <div class="object-cover relative aspect-square">
                    <Show when={amount() > 0}>
                      <div
                        class="absolute flex flex-nowrap flex-col justify-center items-center w-full h-full"
                        style="background: rgba(0,0,0,0.4)"
                      >
                        <div
                          class="font-mono font-bold text-white text-7xl md:text-8xl"
                          style="text-shadow: 1px 1px 4px #000"
                        >
                          {amount()}
                        </div>
                        <AmountCubes amount={amount} />
                      </div>
                    </Show>
                    <Show when={product.imageUrl == null}>
                      <div class="bg-blue-500 text-4xl w-full h-full mx-auto p-4 text-white overflow-hidden whitespace-pre break-all">
                        {product.name}
                      </div>
                    </Show>
                    <Show when={product.imageUrl != null}>
                      <div class="flex justify-center w-full h-full">
                        <img
                          src={product.imageUrl}
                          class="max-w-full max-h-full"
                          alt="頒布物の画像"
                        />
                      </div>
                    </Show>
                  </div>
                  <div class="text-md overflow-hidden whitespace-nowrap text-ellipsis">
                    {product.name}
                  </div>
                  <div class="text-2xl font-mono">&yen;{separateNumber(product.price)}</div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      area-label="削除"
                      class="text-red-500"
                    >
                      削除
                    </button>
                  </div>
                </div>
              );
            }}
          </For>
        </div>

        <div class="shadow-xl bg-white">
          <div class="m-4">
            <For each={cart().content()}>
              {(cartItem) => {
                const product = products().find((e) => e.id === cartItem.productId);

                if (product == null) return null;

                return (
                  <div class="flex gap-4 items-center border-y">
                    <div class="flex items-center">
                      <button
                        class="flex-auto px-6 py-4 text-2xl hover:bg-zinc-100 focus:bg-zinc-200"
                        onClick={() => removeFromCart(cartItem.productId)}
                      >
                        -
                      </button>
                      <div class="w-12 md:w-52 text-center mx-4 text-mono font-bold text-3xl">
                        {cartItem.amount}
                      </div>
                      <button
                        class="flex-auto px-6 py-4 text-2xl hover:bg-zinc-100 focus:bg-zinc-200"
                        onClick={() => addToCart(cartItem.productId)}
                      >
                        +
                      </button>
                    </div>
                    <div>
                      <div class="text-xl">{product.name}</div>
                      <div>
                        <PriceDisplay price={() => product.price} />
                      </div>
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
          <div class="flex p-4 items-end">
            <div class="flex-auto">
              <div class="text-xl text-zinc-700 my-2">合計</div>
              <div class="text-5xl text-end">
                <PriceDisplay price={totalPrice} />
              </div>
            </div>
            <div class="basis-3/12 lg:basis-60 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => clearCart()}
                class="bg-zinc-500 hover:bg-zinc-700 focus:bg-zinc-600 transition-colors text-white py-2 px-2 shadow"
              >
                クリア
              </button>
              <button
                type="button"
                class="bg-blue-500 hover:bg-blue-700 focus:bg-blue-600 disabled:bg-blue-900 disabled:text-zinc-400 transition-colors text-3xl text-white py-4 px-4 shadow"
                disabled={cart().isEmpty()}
              >
                会計
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
