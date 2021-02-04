import test from 'ava'
import { BaseConfig, ConfigNotFound, EnvironmentNotSpecified } from '../src'

class Config extends BaseConfig {
  secret: string
}

Config.add({ secret: 'this-is-secret' }, 'test')

test('basic class loading', (t) => {
  const cfg = Config.load({ env: 'test' })

  t.true(cfg instanceof Config)
  t.is(cfg.secret, 'this-is-secret')
})

test('load config without env option (which defaults to NODE_ENV)', (t) => {
  const cfg = Config.load()

  t.true(cfg instanceof Config)
  t.is(cfg.secret, 'this-is-secret')
})

test('throw error with undefined environment', (t) => {
  delete process.env.NODE_ENV
  t.throws(
    () => Config.load({ env: undefined }),
    {
      instanceOf: EnvironmentNotSpecified,
    },
    'Environment was not specified',
  )
  process.env.NODE_ENV = 'test'
})

test('throw error with unknown environment', (t) => {
  const env = 'prod'
  t.throws(
    () => Config.load({ env }),
    {
      instanceOf: ConfigNotFound,
    },
    `configuration for "${env}" was not found`,
  )
})
