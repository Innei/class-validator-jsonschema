// tslint:disable:no-submodule-imports
import { Exclude } from 'class-transformer'
import { Allow, IsString } from 'class-validator'
import { validationMetadatasToSchemas } from '../src'
const { defaultMetadataStorage } = require('class-transformer/cjs/storage')

class Parent {
  @Allow()
  inherited: unknown

  @Exclude()
  @Allow()
  inheritedInternal: unknown
}

// @ts-ignore unused
class User extends Parent {
  @IsString()
  id: string

  @Exclude()
  @Allow()
  internal: unknown
}

describe('Exclude() decorator', () => {
  it('omits Exclude()-decorated properties from output schema', () => {
    const schema = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
    })

    expect(schema).toEqual({
      Parent: {
        properties: {
          inherited: {},
        },
        type: 'object',
        required: ['inherited'],
      },
      User: {
        properties: {
          id: { type: 'string' },
          inherited: {},
        },
        type: 'object',
        required: ['id', 'inherited'],
      },
    })
  })

  it('do not omits Exclude()-decorated properties from output schema', () => {
    const schema = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      doNotExcludeDecorator: true,
    })

    expect(schema).toEqual({
      Parent: {
        properties: {
          inherited: {},
          inheritedInternal: {},
        },
        type: 'object',
        required: ['inherited', 'inheritedInternal'],
      },
      User: {
        properties: {
          id: { type: 'string' },
          inherited: {},
          inheritedInternal: {},
          internal: {},
        },
        type: 'object',
        required: ['id', 'internal', 'inherited', 'inheritedInternal'],
      },
    })
  })
})
