export const createRef = <T extends object>(
  ...refs: Array<undefined | T | ((ref: T) => void)>
) => {
  let currentRef: T

  return new Proxy(() => {}, {
    apply(_target, _thisArg, [ref]: [T]) {
      currentRef = ref
      refs.forEach(setRef => {
        if (typeof setRef === 'function') {
          setRef(ref)
        }
      })
    },
    get(_target, property) {
      const value = currentRef![property as keyof T]
      if (value instanceof Function) {
        return value.bind(currentRef)
      }
      return value
    },
    set(_target, property, value) {
      currentRef![property as keyof T] = value
      return true
    },
    getPrototypeOf() {
      return Object.getPrototypeOf(currentRef!)
    },
  }) as T
}
