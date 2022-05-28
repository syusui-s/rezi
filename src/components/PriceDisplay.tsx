import type { Component } from 'solid-js';

import commafy from '@/utils/commafy';

export type PriceDisplayProps = {
  price: number;
};

const PriceDisplay: Component<PriceDisplayProps> = (props) => (
  <span class="font-mono">&yen;{commafy(props.price)}</span>
);

export default PriceDisplay;
