import test from 'ava'
import { IsIP, IsNumber } from 'class-validator'
import 'reflect-metadata'
import { BaseConfig, ValidationErrors } from '../src'

class Config extends BaseConfig {
  @IsNumber()
  port: number

  @IsIP(4, { groups: ['with options'] })
  host: string
}

test('successful validation without options', (t) => {
  const env = 'successful validation'
  Config.add({ port: 9999, host: '127.0.0.1' }, env)
  const cfg = Config.load({ env, validate: true })

  t.true(cfg instanceof Config)
  t.is(cfg.port, 9999)
  t.is(cfg.host, '127.0.0.1')
})

test('fail validation without options', (t) => {
  const env = 'fail validation'
  Config.add({ port: '9999' } as any, env)
  t.throws(() => Config.load({ env, validate: true }), { instanceOf: ValidationErrors })
})

test('successful validation with options', (t) => {
  const env = 'successful validation with options'
  Config.add({ host: '127.0.0.1' }, env)
  const cfg = Config.load({ env, validate: true, validationOptions: { groups: ['with options'] } })

  t.true(cfg instanceof Config)
  t.is(cfg.host, '127.0.0.1')
})

test('fail validation with options', (t) => {
  const env = 'successful validation'
  Config.add({ port: 9999, host: 'host' }, env)

  t.throws(
    () => Config.load({ env, validate: true, validationOptions: { groups: ['with options'] } }),
    { instanceOf: ValidationErrors },
  )
})
