import test from 'ava'
import { IsBoolean } from 'class-validator'
import 'reflect-metadata'
import { ClassyConfig, Config, Default } from '../src'
import { ValidationErrors } from '../src/errors'

test('validate with class-validator', (t) => {
  @Config()
  class SimpleConfig {
    @IsBoolean()
    @Default(true)
    decorated: boolean
  }

  const loadedConfig = ClassyConfig.load(SimpleConfig, { validate: true })
  t.true(loadedConfig instanceof SimpleConfig)
  t.is(loadedConfig.decorated, true)
})

test('validate with class-validator options', (t) => {
  @Config()
  class SimpleConfig {
    @IsBoolean({ groups: [] })
    @Default('true')
    decorated: boolean
  }

  const loadedConfig = ClassyConfig.load(SimpleConfig, {
    validate: true,
    validationOptions: { groups: ['test'] },
  })
  t.true(loadedConfig instanceof SimpleConfig)
  t.is(loadedConfig.decorated, 'true')
})

test('throws ValidationErrors', (t) => {
  @Config()
  class SimpleConfig {
    @IsBoolean()
    @Default('true')
    decorated: boolean
  }

  const loadedConfig = () =>
    ClassyConfig.load(SimpleConfig, {
      validate: true,
    })

  t.throws(loadedConfig, { instanceOf: ValidationErrors })
})
