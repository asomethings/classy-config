import test from 'ava'
import 'reflect-metadata'
import { ClassyConfig, Config, Default } from '../src'

test('load config with one class', (t) => {
  @Config()
  class SimpleConfig {
    @Default('something very secret')
    public secretKey: string
  }

  const loadedConfig = ClassyConfig.load(SimpleConfig) as SimpleConfig

  t.true(loadedConfig instanceof SimpleConfig)
  t.is(loadedConfig.secretKey, 'something very secret')
})

test('load config with two classes', (t) => {
  @Config()
  class ConfigOne {
    @Default(1)
    public one: number
  }

  @Config()
  class ConfigTwo {
    @Default(2)
    public two: number
  }

  const loadedConfig = ClassyConfig.load([ConfigOne, ConfigTwo]) as ConfigOne & ConfigTwo

  t.deepEqual(loadedConfig, { one: 1, two: 2 })
})

test.todo('glob based config loading')

test.todo('webpack context based config loading')
