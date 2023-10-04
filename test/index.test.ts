import { describe, expect, it } from 'vitest'
import { getLocalizedMessage } from '../src/utils'

describe('recursive retrieve messages', () => {
  const messages = {
    en: {
      intro: 'Hello World',
      named: '{msg} World',
      list: '{0} World',
      arrayWithValues: [
        'Array Item 1',
        'Array Item 2',
      ],
    },
  }

  it('should support general formatting', () => {
    const result = getLocalizedMessage({
      chain: ['en', 'intro'],
      messages,
    })
    expect(result).toBe('Hello World')
  })

  it('should support named formatting', () => {
    const result = getLocalizedMessage({
      chain: ['en', 'named'],
      messages,
      params: { msg: 'My' },
    })
    expect(result).toBe('My World')
  })

  it('should support list formatting with an array', () => {
    const result = getLocalizedMessage({
      chain: ['en', 'list'],
      messages,
      params: ['My'],
    })
    expect(result).toBe('My World')
  })

  it('should support list formatting with array-like objects', () => {
    const result = getLocalizedMessage({
      chain: ['en', 'list'],
      messages,
      params: { 0: 'My' },
    })
    expect(result).toBe('My World')
  })

  it('should support retrieving array items', () => {
    const result = getLocalizedMessage({
      chain: ['en', 'arrayWithValues[0]'],
      messages,
    })
    expect(result).toBe('Array Item 1')
  })

  it('should support retrieving nested array items', () => {
    const nestedMessages = {
      en: {
        nestedArray: [
          { key: 'Nested Item 1' },
          { key: 'Nested Item 2' },
        ],
      },
    }
    const result = getLocalizedMessage({
      chain: ['en', 'nestedArray[1]', 'key'],
      messages: nestedMessages,
    })
    expect(result).toBe('Nested Item 2')
  })

  it('should throw an error when message is not found', () => {
    expect(() => getLocalizedMessage({
      chain: ['en', 'nonexistent'],
      messages,
    })).toThrowError(
      'Message "en.nonexistent" not found',
    )
  })

  it('should throw an error when parameter is not found', () => {
    expect(() => getLocalizedMessage({
      chain: ['en', 'named'],
      messages,
      params: { notFound: 'value' },
    })).toThrowError(
      'Parameter "msg" not found',
    )
  })

  it('should support deeply nested keys', () => {
    const nestedMessages = {
      en: {
        level1: {
          level2: {
            level3: 'Deeply Nested',
          },
        },
      },
    }
    const result = getLocalizedMessage({
      chain: ['en', 'level1', 'level2', 'level3'],
      messages: nestedMessages,
    })
    expect(result).toBe('Deeply Nested')
  })

  it('should support a mix of named and list formatting', () => {
    const mixedMessages = {
      en: {
        mixed: '{0} {1}, {name}',
      },
    }
    const result = getLocalizedMessage({
      chain: ['en', 'mixed'],
      messages: mixedMessages,
      params: { 0: 'Hi', 1: 'there', name: 'World' },
    })
    expect(result).toBe('Hi there, World')
  })

  it('should throw an error for an invalid array index', () => {
    expect(() => getLocalizedMessage({
      chain: ['en', 'arrayWithValues[-1]'],
      messages,
    })).toThrowError(
      'Invalid array index "-1" for message "en.arrayWithValues[-1]"',
    )
  })

  it('should throw an error for a missing array key', () => {
    expect(() => getLocalizedMessage({
      chain: ['en', 'missingArray[0]'],
      messages,
    })).toThrowError(
      'Message "en.missingArray[0]" not found',
    )
  })
})
