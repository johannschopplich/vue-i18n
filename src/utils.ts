export function getLocalizedMessage(
  chain: string[],
  messages: Record<string, any>,
  params?: Record<string, any> | any[],
  originalChain?: string[],
): string {
  const key = chain[0]

  if (!originalChain)
    originalChain = [...chain]

  if (key.includes('[')) {
    const [objKey, rest] = key.split('[')
    const num = Number.parseInt(rest.replace(']', ''))

    if (num < 0)
      throw new Error(`Invalid array index "${num}" for message "${originalChain.join('.')}"`)

    if (!messages[objKey] || !Array.isArray(messages[objKey]) || messages[objKey].length === 0)
      throw new Error(`Message "${originalChain.join('.')}" not found`)

    const message = messages[objKey][num]

    if (chain.length === 1)
      return typeof message === 'string' ? message : ''

    return getLocalizedMessage(chain.slice(1), message, params, originalChain)
  }

  const message = messages[key]

  if (!message && message !== '')
    throw new Error(`Message "${originalChain.join('.')}" not found`)

  if (chain.length === 1) {
    let str: string = typeof message === 'string' ? message : ''

    if (params) {
      str = str.replace(/{(\w*)}/g, (_, paramName) => {
        if (!(paramName in params))
          throw new Error(`Parameter "${paramName}" not found`)

        if (Array.isArray(params)) {
          if (Number.isNaN(Number(paramName)))
            throw new Error(`Parameter "${paramName}" not found`)

          return params[paramName]
        }

        return params[paramName]
      })
    }

    return str
  }

  return getLocalizedMessage(chain.slice(1), message, params, originalChain)
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
