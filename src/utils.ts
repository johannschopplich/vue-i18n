import type { LocaleMessage, MessageParameters } from './types'

const ARRAY_ACCESS_RE = /^(\w+)\[(\d+)\]$/
const PARAM_PLACEHOLDER_RE = /\{(\w+)\}/g

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
  const key = chain[0]!

  // Initialize the original key's chain
  initialChain ??= [...chain]

  // Handle array indices
  if (key.includes('[')) {
    const match = key.match(ARRAY_ACCESS_RE)
    if (!match)
      throw new Error(`Invalid array access syntax in "${initialChain.join('.')}"`)
    const messageKey = match[1]
    const index = Number.parseInt(match[2]!, 10)

    const record = messages[messageKey!]

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

    return message.replace(PARAM_PLACEHOLDER_RE, (_, paramName) => {
      if (Array.isArray(params)) {
        const paramIndex = Number(paramName)
        if (Number.isNaN(paramIndex))
          throw new Error(`Parameter "${paramName}" not found`)
        if (paramIndex < 0 || paramIndex >= params.length)
          throw new Error(`Parameter index ${paramIndex} is out of bounds (array length: ${params.length})`)
        return String(params[paramIndex])
      }

      if (!(paramName in params))
        throw new Error(`Parameter "${paramName}" not found`)

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
