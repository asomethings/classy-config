export class ConfigNotFound extends Error {
  constructor(environment: string) {
    super(`configuration for "${environment}" was not found`)
  }
}
