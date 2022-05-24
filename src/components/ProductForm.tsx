import type { Component, JSX } from 'solid-js';
import { createSignal, Show } from 'solid-js';

export type ProductFormInput = {
  name: string;
  price: number;
  imageUrl?: string;
};

export type ProductInputProps = {
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

  const { fileUrl: imageUrl, handleChange: handleFileChange, clearUrl } = useFileUrl();

  const handleSubmit: JSX.EventHandler<HTMLFormElement, Event> = (ev) => {
    ev.preventDefault();

    if (nameEl == null || priceEl == null || fileEl == null) {
      return;
    }

    const name = nameEl.value;
    const price = Number(priceEl.value);

    props.onSubmit({ name, price, imageUrl: imageUrl() });
    ev.currentTarget.reset();
    clearUrl();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div class="px-4 py-3">
        <label>
          <div>品名</div>
          <input ref={nameEl} type="text" name="name" required class="form-input" />
        </label>
      </div>
      <div class="px-4 py-3">
        <label>
          <div>価格</div>
          <input ref={priceEl} type="number" name="price" min="0" required class="form-input" />
        </label>
      </div>
      <div class="px-4 py-3">
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
        <Show when={imageUrl() != null}>
          <img src={imageUrl()} class="w-32" alt="画像プレビュー" />
        </Show>
      </div>
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4">
        登録
      </button>
    </form>
  );
};

export default ProductForm;
