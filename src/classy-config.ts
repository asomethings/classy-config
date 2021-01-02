import glob from 'glob'
import path from 'path'
import { CONFIG_DECORATOR_KEY, CONFIG_PROPERTIES, DEFAULT_DECORATOR_KEY } from './constants'
import { ValidationErrors } from './errors'
import { ClassyConfigOptions, ConfigMetadata, DefaultMetadata } from './interfaces'
import { ConfigsOrWebpackContext } from './types'

export class ClassyConfig {
  constructor(private readonly classes: Function[], private options: ClassyConfigOptions) {}

  private build(): Record<string, any> {
    return this.classes
      .map((cls) => [cls, this.applyMetadata(cls)])
      .map(([cls, plain]) => this.transform(cls as Function, plain))
      .map((instance) => this.validate(instance))
      .reduce((acc: Record<string, any>, val: any, _idx: number, array: any[]) => {
        const configMetadata = this.getConfigValue(val.constructor)

        // If array has only one config instance without name then just return class instance
        if (array.length === 1 && !configMetadata.name) {
          return val
        }

        if (configMetadata.name) {
          return {
            ...acc,
            [configMetadata.name]: val,
          }
        }

        return { ...acc, ...val }
      }, {})
  }

  /**
   * Applies metadata to class type
   *
   * @param {Function} target
   */
  private applyMetadata(target: Function): Record<string, any> {
    const properties = this.getProperties(target)

    return properties.reduce((acc, key) => {
      const defaultValue = this.getDefaultValue(target, key)
      return {
        ...acc,
        [key]: defaultValue?.value,
      }
    }, {})
  }

  /**
   * Get Default decorator value
   *
   * @param {Function} target
   * @param {string} key
   */
  private getDefaultValue(target: Function, key: string): DefaultMetadata | undefined {
    const defaultMetadatas: DefaultMetadata[] =
      Reflect.getMetadata(DEFAULT_DECORATOR_KEY, target.prototype, key) ?? []

    if (defaultMetadatas.length < 1) return undefined

    // If options.env is provided
    if (this.options.env) {
      // Default decorators with options.env
      const envDefaults = defaultMetadatas.filter((metadata) =>
        metadata.options?.envs.includes(this.options.env),
      )

      // If there is default decorator with options.env then return first value
      if (envDefaults.length > 0) return envDefaults[0]
    }

    // Default decorator without env options
    const defaultMetadatasWithoutEnvs = defaultMetadatas.filter(
      (metadata) =>
        !metadata.options || !metadata.options.envs || metadata.options.envs.length === 0,
    )

    return defaultMetadatasWithoutEnvs[0]
  }

  /**
   * Get CONFIG_DECORATOR_KEY from class metadata using reflect-metadata
   *
   * @param {Function} target
   */
  private getConfigValue(target: Function): ConfigMetadata | undefined {
    return Reflect.getOwnMetadata(CONFIG_DECORATOR_KEY, target)
  }

  /**
   * Get CONFIG_PROPERTIES from class metadata using reflect-metadata
   *
   * @param {Function} target
   */
  private getProperties(target: Function): string[] {
    return Reflect.getMetadata(CONFIG_PROPERTIES, target.prototype) ?? []
  }

  /**
   * Transforms plain object with class-transformer when transform option is enabled, otherwise initiates class and assigns
   *
   * @param {Function} target
   * @param {Record<string, any>} plain
   */
  private transform(target: Function, plain: Record<string, any>): any {
    if (this.options.transform) {
      return this.transformer.plainToClass(target, plain, this.options.transformOptions)
    }

    return Object.assign(new (target as any)(), plain)
  }

  /**
   * Validate using class-validator
   *
   * @param {Function} instance
   */
  private validate(instance: Function): any {
    if (this.options.validate) {
      const errors = this.validator.validateSync(instance, this.options.validationOptions)
      if (errors.length) throw new ValidationErrors(errors)
    }

    return instance
  }

  private get transformer(): any {
    return require('class-transformer')
  }

  private get validator(): any {
    return require('class-validator')
  }

  public static load(
    webpackContext: __WebpackModuleApi.RequireContext,
    options?: ClassyConfigOptions,
  ): Record<string, any>

  public static load(config: Function, options?: ClassyConfigOptions): Record<string, any>

  public static load(config: string, options?: ClassyConfigOptions): Record<string, any>

  public static load(
    configs: (Function | string)[],
    options?: ClassyConfigOptions,
  ): Record<string, any>

  public static load(
    configsOrWebpackContext: ConfigsOrWebpackContext,
    options?: ClassyConfigOptions,
  ): Record<string, any>

  public static load(
    configsOrWebpackContext: ConfigsOrWebpackContext,
    options: ClassyConfigOptions = { env: process.env.NODE_ENV },
  ): Record<string, any> {
    const dirs: string[] = []
    const classes: Function[] = []

    // If webpack context is passed it will transform it to an array of classes
    // Else it will split it to classes and directories
    if (this.isWebpackContext(configsOrWebpackContext)) {
      const context = configsOrWebpackContext
      classes.push(
        ...(context
          .keys()
          .map((id) => Object.values(context(id)))
          .flat() as Function[]),
      )
    } else {
      const configs = Array.isArray(configsOrWebpackContext)
        ? configsOrWebpackContext
        : [configsOrWebpackContext]
      dirs.push(...configs.filter((c: any): c is string => typeof c === 'string'))
      classes.push(...configs.filter((c: any): c is Function => typeof c === 'function'))
    }

    // Reads directory and load the class from file
    const files = dirs
      .map((pattern) => glob.sync(path.normalize(pattern)))
      .flat()
      .map((dir) => require(path.resolve(dir)))
      .map((obj) => Object.values<Function>(obj))
      .flat()
      .filter((cls: Function): cls is Function => typeof cls === 'function')

    // Filters non-config classes
    const configs = [...classes, ...files].filter((cls) =>
      Reflect.hasMetadata(CONFIG_DECORATOR_KEY, cls),
    )

    return new ClassyConfig(configs, options).build()
  }

  /**
   * Checks if passed argument is a webpack context
   *
   * @param {any} context
   */
  private static isWebpackContext(context: any): context is __WebpackModuleApi.RequireContext {
    return (
      'keys' in context && 'resolve' in context && 'id' in context && typeof context === 'function'
    )
  }
}
