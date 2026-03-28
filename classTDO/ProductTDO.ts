// DTO for Homework 11
export class ProductTDO {
  id: number;
  name: string;
  price: number;
  createdAt: string | null;

  constructor(id: number, name: string, price: number, createdAt: string | null) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.createdAt = createdAt;
  }
}