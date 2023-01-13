import { Component, JSX, onMount, createSignal, Show } from 'solid-js';

import useResizedImage from '@/useResizedImage';
import Product from '@/models/Product';

export type ProductFormInput = {
  name: string;
  price: number;
  imageUrl?: string;
};

export type ProductInputProps = {
  product?: Product;
  onSubmit: (input: ProductFormInput) => void;
};

const useFileUrl = () => {
  const [fileUrl, setFileUrl] = createSignal<string | undefined>();

  const handleChange: JSX.EventHandler<HTMLInputElement, Event> = (ev) => {
    const reader = new FileReader();
    const file = ev.currentTarget.files?.[0];
    if (file == null) {
      return;
    }
    reader.addEventListener('load', () => {
      setFileUrl(reader.result as string);
    });
    reader.readAsDataURL(file);
  };

  const clearUrl = () => setFileUrl(undefined);

  return { fileUrl, handleChange, clearUrl };
};

const ProductForm: Component<ProductInputProps> = (props) => {
  let nameEl: HTMLInputElement | undefined;
  let priceEl: HTMLInputElement | undefined;
  let fileEl: HTMLInputElement | undefined;

  const [defaultImageUrl, setDefaultImageUrl] = createSignal<string | undefined>();
  const { fileUrl: imageUrl, handleChange: handleFileChange, clearUrl } = useFileUrl();

  const resizedImage = useResizedImage({
    imageUrl,
    height: 255,
    width: 255,
    encoderOption: 0.7,
  });

  onMount(() => {
    if (nameEl == null || priceEl == null || fileEl == null) return;
    nameEl.value = props.product?.name || '';
    priceEl.value = props.product?.price?.toString() || '';
    setDefaultImageUrl(props.product?.imageUrl);
  });

  const handleSubmit: JSX.EventHandler<HTMLFormElement, Event> = (ev) => {
    ev.preventDefault();

    if (nameEl == null || priceEl == null || fileEl == null) {
      return;
    }

    const name = nameEl.value;
    const price = Number(priceEl.value);

    props.onSubmit({
      name,
      price,
      imageUrl: resizedImage() ?? defaultImageUrl(),
    });
    ev.currentTarget.reset();
    clearUrl();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div class="py-3">
        <label>
          <div>品名</div>
          <input ref={nameEl} type="text" name="name" required class="form-input" />
        </label>
      </div>
      <div class="py-3">
        <label>
          <div>価格</div>
          <input ref={priceEl} type="number" name="price" min="0" required class="form-input" />
        </label>
      </div>
      <div class="py-3">
        <label>
          <div>画像</div>
          <input
            ref={fileEl}
            type="file"
            name="image"
            accept="image/jpeg, image/png, image/gif"
            class="form-input"
            onChange={handleFileChange}
          />
        </label>
        <Show when={resizedImage() != null || defaultImageUrl() != null}>
          <img src={resizedImage() ?? defaultImageUrl()} class="w-32" alt="画像プレビュー" />
        </Show>
      </div>
      <div class="py-3">
        <button type="submit" class="bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
          登録
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
