export class EnvironmentNotSpecified extends Error {
  constructor() {
    super('Environment was not specified')
  }
}
