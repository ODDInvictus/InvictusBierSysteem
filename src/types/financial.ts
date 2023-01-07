import { User } from './users'

export type ProductCategory = {
  name: string
  id: number
  image: string
}

export type Product = {
  id: number
  name: string
  category: ProductCategory
  price: number
}

export type AlcoholProduct = Product & {
  alcohol_percentage: number
  volume: number
}

export type FoodProduct = Product & {
  kcal: number
  weight: number
}

export type Transaction = {
  id: number
  date: string
  price: number

  added_by: User
  user: User

  settled: boolean
  deleted: User
}

export type ContributionTransaction = Transaction

export type SaleTransaction = Transaction & {
  product: Product
  amount: number
}
