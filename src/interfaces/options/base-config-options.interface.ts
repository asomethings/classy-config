import { ClassTransformOptions } from 'class-transformer'
import { ValidationOptions } from 'class-validator'

export interface BaseConfigOptions {
  env?: string

  transform?: boolean

  validate?: boolean

  transformOptions?: ClassTransformOptions

  validationOptions?: ValidationOptions
}
