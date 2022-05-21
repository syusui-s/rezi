export default class Product {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly price: number,
    readonly imageUrl?: string,
  ) {}
}
