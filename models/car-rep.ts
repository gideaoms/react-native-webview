import { Models } from './models.js'

export namespace Car2 {
  export type Repository = {
    update: (car: Models) => Promise<Models.Car.Model>
  }
}