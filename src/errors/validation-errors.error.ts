import { ValidationError } from 'class-validator'

export class ValidationErrors extends Error {
  constructor(private readonly errors: ValidationError[]) {
    super(errors.map((error) => error.toString()).join('\n'))
  }
}
