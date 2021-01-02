export type ConfigsOrWebpackContext =
  | __WebpackModuleApi.RequireContext
  | Function
  | string
  | (Function | string)[]
