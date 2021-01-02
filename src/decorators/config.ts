import { CONFIG_DECORATOR_KEY } from '../constants'

export const Config = (name?: string): ClassDecorator => {
  return (target: Function): void => Reflect.defineMetadata(CONFIG_DECORATOR_KEY, { name }, target)
}
