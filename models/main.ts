import { Models } from './models'

const car1 = Models.Car.build({ name: 'Car 1' })
const car2 = Models.Car.empty

console.log(car1.status, car2.status)


if (Models.Car.isActive(car1)) {
  console.log(`Car ${car1.name} is active`)
}