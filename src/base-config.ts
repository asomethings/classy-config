import { Class, PartialDeep } from 'type-fest'
import { ConfigNotFound, EnvironmentNotSpecified, ValidationErrors } from './errors'
import { BaseConfigOptions } from './interfaces'

export abstract class BaseConfig {
  public static readonly __configs: Record<string, any> = {}

  public static add<T>(
    this: Class<T> & typeof BaseConfig,
    config: PartialDeep<T>,
    env: string,
  ): void {
    this.__configs[env] = config
  }

  public static load<T>(
    this: Class<T> & typeof BaseConfig,
    options: BaseConfigOptions = { env: process.env.NODE_ENV },
  ): T {
    const environment = options.env ?? process.env.NODE_ENV
    if (!environment) {
      throw new EnvironmentNotSpecified()
    }

    const config = this.__configs[environment]
    if (!config) {
      throw new ConfigNotFound(environment)
    }

    const clsConfig = this.transformToClass(config, options)

    if (!options?.validate) {
      return clsConfig
    }

    return this.validateConfig(clsConfig, options)
  }

  private static transformToClass(
    config: Record<string, any>,
    options?: Pick<BaseConfigOptions, 'transform' | 'transformOptions'>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const cls: any = this
    if (!options?.transform) {
      return Object.assign(new cls(), config)
    }

    return this.transformer.plainToClass(cls, config, options?.transformOptions ?? {})
  }

  private static validateConfig<T>(
    config: T,
    options?: Pick<BaseConfigOptions, 'validate' | 'validationOptions'>,
  ): T {
    if (!options?.validate) {
      return config
    }

    const errors = this.validator.validateSync(config, options?.validationOptions ?? {})
    if (errors.length > 0) {
      throw new ValidationErrors(errors)
    }

    return config
  }

  private static get transformer(): any {
    return require('class-transformer')
  }

  private static get validator(): any {
    return require('class-validator')
  }
}
