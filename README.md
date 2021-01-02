# classy-config

Better configuration with power of classes and decorators

## Installation

1. Install `classy-config`

   `pnpm add classy-config`

2. Install `reflect-metadata`

   `pnpm add reflect-metadata`

3. Install `class-transformer` and `class-validator` (optional)

   `pnpm add class-transformer`

   `pnpm add class-validator`

## Loading configuration

### `ClassyConfig.load`

This loads configuration from class, glob path, webpack context

```typescript
import { ClassyConfig } from 'classy-config'

// Using class
const loadingWithClass = ClassyConfig.load(MainConfig)

// Using glob
const loadingWithGlob = ClassyConfig.load('./config/*.config{.ts,.js}')

// Using webpack context
const loadingWithContext = ClassyConfig.load(require.context('.', true, /\.config\.ts$/))
```

class type and glob string can be passed with an array

You can pass env to override picking up `process.env.NODE_ENV`
```typescript
import { ClassyConfig } from 'classy-config'

ClassyConfig.load(MainConfig, { env: 'new-env' })
```

## Creating configuration
If only one class without name picked up, it will create a **class instance**
```typescript
import { ClassyConfig } from 'classy-config'

@Config()
export class MainConfig {
  @Default(process.env.SECRET_KEY, { envs: ['prod', 'dev'] })
  @Default('this-is-going-to-be-secret')
  secretKey: string
}

const loadedConfig = ClassyConfig.load(MainConfig);
console.log(loadedConfig)
/*
MainConfig {
  secretKey: 'this-is-going-to-be-secret'
}
*/
```

If multiple classes is passed it will create an object
```typescript
import { ClassyConfig } from 'classy-config'

@Config()
export class ConfigOne {
  @Default(process.env.SECRET_KEY, { envs: ['prod', 'dev'] })
  @Default('this-is-going-to-be-secret')
  secretKey: string
}

@Config()
export class ConfigTwo {
  @Default(process.env.NAME, { envs: ['prod', 'dev'] })
  @Default('foo')
  name: string
}

const loadedConfig = ClassyConfig.load([ConfigOne, ConfigTwo]);
console.log(loadedConfig)
/*
{
  secretKey: 'this-is-going-to-be-secret',
  name: 'foo'
}
*/
```

If multiple classes is passed with names it will create an object with key as name and value as class instance
```typescript
import { ClassyConfig } from 'classy-config'

@Config('one')
export class ConfigOne {
  @Default(process.env.SECRET_KEY, { envs: ['prod', 'dev'] })
  @Default('this-is-going-to-be-secret')
  secretKey: string
}

@Config('two')
export class ConfigTwo {
  @Default(process.env.NAME, { envs: ['prod', 'dev'] })
  @Default('foo')
  name: string
}

const loadedConfig = ClassyConfig.load([ConfigOne, ConfigTwo]);
console.log(loadedConfig)
/*
{
  one: [class ConfigOne],
  two: [class ConfigTwo],
}
*/
```

## Transforming
After default values are initiated, transform will occur.

Enable transform with `transform: true` while loading configuration. If options are needed then pass `transformOptions` with `transform: true`

```typescript
import { ClassyConfig } from 'classy-config'
import { Type } from 'class-transformer'

@Config()
export class MainConfig {
  @Default('1')
  @Type(() => Number)
  num: number
}

const loadedConfig = ClassyConfig.load(MainConfig, { transform: true });
console.log(loadedConfig)
/*
MainConfig {
  num: 1
}
*/
```

## Validating
After transformations are done, it will validate configuration files.

Enable validation with `validate: true` while loading configuration. If options are needed then pass `validationOptions` with `validate: true`

Currently, validation does not (yet) run in parallel.

```typescript
import { ClassyConfig } from 'classy-config'
import { Type } from 'class-transformer'

@Config()
export class MainConfig {
  @Default('1')
  @IsNumber()
  @Type(() => String)
  num: number
}

const loadedConfig = ClassyConfig.load(MainConfig, { validate: true });
// Throws ValidationErrors
```
