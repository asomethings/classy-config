import test from 'ava'
import 'reflect-metadata'
import { ClassyConfig, Config } from '../src'

test('config decorator without name', (t) => {
  @Config()
  class SimpleConfig {}

  const loadedConfig = ClassyConfig.load(SimpleConfig)
  t.true(loadedConfig instanceof SimpleConfig)
})

test('config decorator with name', (t) => {
  @Config('simple')
  class SimpleConfig {}

  const loadedConfig = ClassyConfig.load(SimpleConfig)
  t.true(loadedConfig.simple instanceof SimpleConfig)
})
