export interface Player {
  _id: string;
  name: string;
  lastName: string;
  nationality: string;
  team: string;
  age: number;
  number: number;
  value: number;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
