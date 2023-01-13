import { Component, JSX, onMount } from 'solid-js';

import Catalog from '@/models/Catalog';

export type CatalogFormInput = {
  name: string;
};

export type CatalogInputProps = {
  catalog?: Catalog;
  onSubmit: (input: CatalogFormInput) => void;
};

const CatalogForm: Component<CatalogInputProps> = (props) => {
  let nameEl: HTMLInputElement | undefined;

  onMount(() => {
    if (nameEl == null) return;
    nameEl.value = props.catalog?.name || '';
  });

  const handleSubmit: JSX.EventHandler<HTMLFormElement, Event> = (ev) => {
    ev.preventDefault();

    if (nameEl == null) {
      return;
    }

    const name = nameEl.value;
    props.onSubmit({ name });
    ev.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div class="py-3">
        <label>
          <div>カタログ名</div>
          <input ref={nameEl} type="text" name="name" required class="form-input" />
        </label>
      </div>
      <div class="py-3">
        <button type="submit" class="bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
          登録
        </button>
      </div>
    </form>
  );
};

export default CatalogForm;
