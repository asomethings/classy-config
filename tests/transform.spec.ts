import test from 'ava'
import { Expose, Type } from 'class-transformer'
import 'reflect-metadata'
import { BaseConfig } from '../src'

class Config extends BaseConfig {
  @Expose()
  @Type(() => Number)
  port: number
}

Config.add({ port: '9999', host: '127.0.0.1' } as any, 'test')

test('transform without options', (t) => {
  const cfg = Config.load({ transform: true })

  t.true(cfg instanceof Config)
  t.is(cfg.port, 9999)
})

test('transform with options', (t) => {
  const cfg = Config.load({
    transform: true,
    transformOptions: {
      excludeExtraneousValues: true,
    },
  })

  t.true(cfg instanceof Config)
  t.is(cfg.port, 9999)
  t.is(cfg['host'], undefined)
})
