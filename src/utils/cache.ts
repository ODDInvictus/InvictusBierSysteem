class Cache {

  set(key: string, obj: any) {
    localStorage.setItem(`ibs::${key}`, JSON.stringify(obj))
    window.dispatchEvent(new Event(`ibs::cache::${key}`))
  }

  getWhenAvaliable<T>(key: string): Promise<T> {
    // Is it already in local storage?
    const cache = localStorage.getItem(`ibs::${key}`)
    if (cache !== null) {
      return new Promise((resolve, reject) => {resolve(JSON.parse(cache))})
    }

    // If not, wait for the event to trigger
    return new Promise((resolve, reject) => {
      window.addEventListener(`ibs::cache::${key}`, () => {
        resolve(this.get<T>(key)!)
      }, {once: true})
    })
  }

  remove(key: string) {
    localStorage.removeItem(`ibs::${key}`)
    window.dispatchEvent(new Event(`ibs::cache::${key}`))
  }

  get<T>(key: string): T | undefined {
    const cache = localStorage.getItem(`ibs::${key}`)
    if (cache) return JSON.parse(cache)
    return undefined
  }
}

export const cache = new Cache()