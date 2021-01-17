# classy-config

[![codecov](https://codecov.io/gh/asomethings/classy-config/branch/main/graph/badge.svg?token=P005JbPkOM)](https://codecov.io/gh/asomethings/classy-config)

Better configuration with power of classes and typescript

## Installation

1. Install `classy-config`

   `pnpm add classy-config`

2. Install `class-transformer` and `class-validator` (optional)

   `pnpm add class-transformer`

   `pnpm add class-validator`

## Adding configuration

### `BaseConfig.add`

This adds configuration to config container

```typescript
import { BaseConfig } from 'classy-config'

class Config extends BaseConfig {
  secret: string
}

Config.add({ secret: 'this-is-secret' }, 'dev')
// Adds configuration to container only for dev environment
```

## Loading configuration

It returns a class instance if config was successfully loaded

```typescript
import { BaseConfig } from 'classy-config'

class Config extends BaseConfig {
  secret: string
}

Config.add({ secret: 'this-is-secret' }, 'dev')

const cfg = ClassyConfig.load()
console.log(cfg)
/*
Config {
  secretKey: 'this-is-secret'
}
*/
```

You can specify environment for loading config

```typescript
import { BaseConfig } from 'classy-config'

class Config extends BaseConfig {
  secret: string
}

Config.add({ secret: 'this-is-secret' }, 'dev')

const cfg = Config.load({ env: 'dev' })
console.log(cfg)
/*
Config {
  secretKey: 'this-is-secret'
}
*/
```

## Transforming

After default values are initiated, transform will occur.

Enable transform with `transform: true` while loading configuration. If options are needed then pass `transformOptions` with `transform: true`

```typescript
import 'reflect-metadata'
import { BaseConfig } from 'classy-config'
import { Type } from 'class-transformer'

class Config extends BaseConfig {
  @Type(() => Number)
  port: number
}

Config.add({ port: '9999' }, 'dev')

const cfg = Config.load({ transform: true })
console.log(cfg)
/*
Config {
  port: 9999
}
*/
```

## Validating

After transformations are done, it will validate configuration files.

Enable validation with `validate: true` while loading configuration. If options are needed then pass `validationOptions` with `validate: true`

Currently, validation does not (yet) run in parallel.

```typescript
import 'reflect-metadata'
import { BaseConfig } from 'classy-config'
import { Type } from 'class-transformer'

class Config extends BaseConfig {
  @IsNumber()
  port: number
}

Config.add({ port: '9999' }, 'dev')

Config.load({ validate: true })
// Throws ValidationErrors
```
