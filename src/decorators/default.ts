import { CONFIG_PROPERTIES, DEFAULT_DECORATOR_KEY } from '../constants'
import { DefaultOptions } from '../interfaces'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const Default = (value: any, options?: DefaultOptions): PropertyDecorator => {
  return (target: Function, propertyKey: string): void => {
    const properties = Reflect.getMetadata(CONFIG_PROPERTIES, target) ?? []
    if (!properties.includes(propertyKey)) {
      Reflect.defineMetadata(CONFIG_PROPERTIES, [...properties, propertyKey], target)
    }

    const originalMetadata = Reflect.getMetadata(DEFAULT_DECORATOR_KEY, target, propertyKey)
    if (!originalMetadata) {
      return Reflect.defineMetadata(
        DEFAULT_DECORATOR_KEY,
        [{ value, options }],
        target,
        propertyKey,
      )
    }

    return Reflect.defineMetadata(
      DEFAULT_DECORATOR_KEY,
      [...originalMetadata, { value, options }],
      target,
      propertyKey,
    )
  }
}
