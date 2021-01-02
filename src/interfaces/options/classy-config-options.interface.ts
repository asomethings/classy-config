import { ClassTransformOptions } from 'class-transformer'
import { ValidationOptions } from 'class-validator'

export interface ClassyConfigOptions {
  env?: string

  transform?: boolean

  validate?: boolean

  transformOptions?: ClassTransformOptions

  validationOptions?: ValidationOptions
}
