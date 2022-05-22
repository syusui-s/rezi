import { Accessor, Component, createSignal, For, Show, Switch, Match } from 'solid-js';
import { Link } from 'solid-app-router';

import AppLayout from './components/AppLayout';
import useCart from './useCart';
import useProducts from './useProducts';
import Product from './models/Product';
import separateNumber from './utils/separateNumber';

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

const CatalogItem = () => {};

const Catalog: Component = () => {
  const [showCart, setShowCart] = createSignal(false);
  const { products, addProduct, removeProduct } = useProducts();
  const { cart, addToCart, removeFromCart, clearCart, totalPrice } = useCart({ products });

  const countItems = () =>
    cart()
      .content()
      .reduce((acc, e) => acc + e.amount, 0);

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
    <AppLayout
      title="カタログ"
      prevElement={
        <Link href="/" class="text-xl font-bold text-blue-500 hover:text-blue-600">
          &lt; ホーム
        </Link>
      }
    >
      <div class="pb-52">
        <div class="my-4 grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2 md:gap-4">
          <For each={products()} fallback={<div>頒布物がまだ登録されていません</div>}>
            {(product) => {
              const amount = () => cart().find(product.id)?.amount ?? 0;
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
                          class="object-contain max-w-full max-h-full"
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

        <div
          class="bg-white container w-full xl:w-8/12 fixed bottom-0"
          style="box-shadow: 0 -4px 10px rgba(0,0,0,0.2)"
        >
          <div class="text-center">
            <Show when={countItems() > 0}>
              <button
                onClick={() => setShowCart(!showCart())}
                class="bg-zinc-100 hover:bg-zinc-200 text-xl py-2 w-full"
              >
                <span>{countItems()}個 </span>
                <Switch>
                  <Match when={showCart()}>
                    <span area-label="Show">▼</span>
                  </Match>
                  <Match when={countItems() > 0}>
                    <span area-label="Show">▲</span>
                  </Match>
                </Switch>
              </button>
            </Show>
          </div>
          <Show when={showCart() && countItems() > 0}>
            <div class="m-4 overflow-scroll" style="max-height: 25vh;">
              <For each={cart().content()}>
                {(cartItem) => {
                  const product = products().find((e) => e.id === cartItem.productId);

                  if (product == null) return null;

                  return (
                    <div class="flex gap-4 items-center border-y">
                      <div class="flex items-center">
                        <button
                          class="flex-auto px-8 py-4 text-2xl hover:bg-zinc-100 focus:bg-zinc-200"
                          onClick={() => removeFromCart(cartItem.productId)}
                        >
                          -
                        </button>
                        <div class="min-w-12 md:w-14 text-center mx-4 text-mono font-bold text-3xl">
                          {cartItem.amount}
                        </div>
                        <button
                          class="flex-auto px-8 py-4 text-2xl hover:bg-zinc-100 focus:bg-zinc-200"
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
          </Show>
          <div class="flex items-center shadow p-4 border-y">
            <div class="flex-auto">
              <div class="text-xl text-zinc-700 my-2">合計</div>
              <div class="text-5xl text-end">
                <PriceDisplay price={totalPrice} />
              </div>
            </div>
            <div class="basis-1/3 sm:basis-1/4 lg:basis-60 flex flex-col gap-2">
              <button
                type="button"
                class="bg-zinc-500 hover:bg-zinc-600 text-white py-2 px-2 shadow-md"
                onClick={() => {
                  clearCart();
                  setShowCart(false);
                }}
              >
                クリア
              </button>
              <button
                type="button"
                class="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-900 disabled:text-zinc-400 text-3xl text-white py-4 px-4 shadow"
                disabled={cart().isEmpty()}
              >
                会計
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Catalog;
