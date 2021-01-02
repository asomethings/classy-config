import test from 'ava'
import 'reflect-metadata'
import { ClassyConfig, Config, Default } from '../src'

test('default decorator with no envs', (t) => {
  @Config()
  class SimpleConfig {
    @Default(true)
    decorated: boolean
  }

  const loadedConfig = ClassyConfig.load(SimpleConfig)
  t.true(loadedConfig instanceof SimpleConfig)
  t.is(loadedConfig.decorated, true)
})

test('default decorator with empty envs', (t) => {
  @Config()
  class SimpleConfig {
    @Default(true, { envs: [] })
    decorated: boolean
  }

  const loadedConfig = ClassyConfig.load(SimpleConfig)
  t.true(loadedConfig instanceof SimpleConfig)
  t.is(loadedConfig.decorated, true)
})

test('default decorator with one envs', (t) => {
  @Config()
  class SimpleConfig {
    @Default(true, { envs: ['test'] })
    @Default(false)
    decorated: boolean
  }

  const loadedConfig = ClassyConfig.load(SimpleConfig, { env: 'test' })
  t.true(loadedConfig instanceof SimpleConfig)
  t.is(loadedConfig.decorated, true)
})

test('default decorator with multiple envs', (t) => {
  @Config()
  class SimpleConfig {
    @Default(true, { envs: ['test', 'development'] })
    @Default(false)
    decorated: boolean
  }

  const loadedConfig = ClassyConfig.load(SimpleConfig, { env: 'test' })
  t.true(loadedConfig instanceof SimpleConfig)
  t.is(loadedConfig.decorated, true)
})

test('multiple default decorators', (t) => {
  @Config()
  class SimpleConfig {
    @Default(1)
    @Default(2)
    @Default(true)
    decorated: boolean
  }

  const loadedConfig = ClassyConfig.load(SimpleConfig)
  t.true(loadedConfig instanceof SimpleConfig)
  t.is(loadedConfig.decorated, true)
})
