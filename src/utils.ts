import { hash } from 'ohash'

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

export function getLocalizedMessage(
  {
    chain,
    initialChain,
    messages,
    params,
  }: {
    chain: string[]
    initialChain?: string[]
    messages: Record<string, string | Record<string, unknown> | unknown[]>
    params?: unknown[] | Record<string, unknown>
  },
): string {
  const key = chain[0]

  // Initialize the original key's chain
  if (!initialChain)
    initialChain = [...chain]

  // Handle array indices
  if (key.includes('[')) {
    const [objKey, rest] = key.split('[')
    const num = Number.parseInt(rest.replace(']', ''), 10)

    if (num < 0)
      throw new Error(`Invalid array index "${num}" for message "${initialChain.join('.')}"`)

    if (!Array.isArray(messages[objKey]) || messages[objKey].length === 0)
      throw new Error(`Message "${initialChain.join('.')}" not found`)

    const message = (messages[objKey] as unknown[])[num]

    if (chain.length === 1)
      return typeof message === 'string' ? message : ''

    return getLocalizedMessage({
      chain: chain.slice(1),
      // @ts-expect-error: We know that message is an object here
      messages: message,
      params,
      initialChain,
    })
  }

  // Handle object keys
  const message = messages[key]

  if (message == null)
    throw new Error(`Message "${initialChain.join('.')}" not found`)

  if (chain.length === 1) {
    let str: string = typeof message === 'string' ? message : ''

    if (params) {
      str = str.replace(/{(\w*)}/g, (_, paramName) => {
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

    return str
  }

  return getLocalizedMessage({
    chain: chain.slice(1),
    // @ts-expect-error: We know that message is an object here
    messages: message,
    params,
    initialChain,
  })
}

export function klona<T>(val: T): T {
  if (Array.isArray(val)) {
    const out = Array.from({ length: val.length })
    for (let i = 0; i < val.length; i++) {
      const tmp = val[i]
      out[i] = tmp && typeof tmp === 'object' ? klona(tmp) : tmp
    }
    return out as T
  }

  if (Object.prototype.toString.call(val) === '[object Object]') {
    const out = Object.create(null)
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      if (k === '__proto__') {
        Object.defineProperty(out, k, {
          value: klona(v),
          configurable: true,
          enumerable: true,
          writable: true,
        })
      }
      else {
        out[k] = v && typeof v === 'object' ? klona(v) : v
      }
    }

    return out as T
  }

  return val
}
