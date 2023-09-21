import { hash } from 'ohash'
import type { LocaleMessage, MessageParameters } from './types'

const cache = new Map<string, string>()

export function getCachedLocalizedMessage(
  locale: string,
  options: Parameters<typeof getLocalizedMessage>[0],
) {
  const key = hash([locale, options.chain, options.params])

  if (cache.has(key))
    return cache.get(key)!

  const message = getLocalizedMessage(options)
  cache.set(key, message)

  return message
}

export function getLocalizedMessage<Message = string>(
  {
    chain,
    messages,
    params,
    initialChain,
  }: {
    chain: string[]
    messages: LocaleMessage<Message>
    params?: MessageParameters
    initialChain?: string[]
  },
): string {
  const key = chain[0]

  // Initialize the original key's chain
  initialChain ||= [...chain]

  // Handle array indices
  if (key.includes('[')) {
    const [messageKey, rest] = key.split('[')
    const index = Number.parseInt(rest.replace(']', ''), 10)

    if (index < 0)
      throw new Error(`Invalid array index "${index}" for message "${initialChain.join('.')}"`)

    const record = messages[messageKey]

    if (!Array.isArray(record) || record.length <= index)
      throw new Error(`Message "${initialChain.join('.')}" not found`)

    const message = record[index]

    if (chain.length === 1)
      return typeof message === 'string' ? message : ''

    return getLocalizedMessage({
      chain: chain.slice(1),
      messages: message as LocaleMessage<Message>,
      params,
      initialChain,
    })
  }

  // Handle object keys
  const message = messages[key]

  if (message == null)
    throw new Error(`Message "${initialChain.join('.')}" not found`)

  if (chain.length === 1) {
    if (typeof message !== 'string')
      return ''

    if (!params)
      return message

    return message.replace(/{(\w*)}/g, (_, paramName) => {
      if (!(paramName in params))
        throw new Error(`Parameter "${paramName}" not found`)

      if (Array.isArray(params)) {
        if (Number.isNaN(Number(paramName)))
          throw new Error(`Parameter "${paramName}" not found`)

        return String(params[paramName])
      }

      return String(params[paramName])
    })
  }

  return getLocalizedMessage({
    chain: chain.slice(1),
    messages: message as LocaleMessage<Message>,
    params,
    initialChain,
  })
}
