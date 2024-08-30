export namespace Car {
  export type Status = 'active' | 'inactive'

  export type Model = {
    readonly id: string
    readonly name: string
    readonly status: Status
  }

  export const empty = build({})

  export function build(car: Partial<Model>) {
    const id = car.id ?? ''
    const name = car.name ?? ''
    const status = car.status ?? 'inactive'
    return { id, name, status } satisfies Model
  }

  export function isActive(car: Model) {
    return car.status === 'active'
  }
}