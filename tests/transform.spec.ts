import test from 'ava'
import { Type } from 'class-transformer'
import 'reflect-metadata'
import { ClassyConfig, Config, Default } from '../src'

test('transform with class-transformer', (t) => {
  @Config()
  class SimpleConfig {
    @Default(1)
    @Type(() => Boolean)
    decorated: boolean
  }

  const loadedConfig = ClassyConfig.load(SimpleConfig, { transform: true })
  t.true(loadedConfig instanceof SimpleConfig)
  t.is(loadedConfig.decorated, true)
})

test('transform with class-transformer options', (t) => {
  @Config()
  class SimpleConfig {
    @Default(1)
    decorated: boolean
  }

  const loadedConfig = ClassyConfig.load(SimpleConfig, {
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  })
  t.true(loadedConfig instanceof SimpleConfig)
  t.is(loadedConfig.decorated, true)
})
