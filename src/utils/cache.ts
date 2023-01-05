
class Cache {

  set(key: string, obj: unknown) {
    localStorage.setItem(`ibs::${key}`, JSON.stringify(obj))
  }

  get<T>(key: string): T | undefined {
    const cache = localStorage.getItem(`ibs::${key}`)
    if (cache) {
      return JSON.parse(cache)
    }
    return undefined
  }

}

export const cache = new Cache()