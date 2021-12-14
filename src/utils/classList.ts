export const classList = (
  ...args: Array<
    | string
    | null
    | undefined
    | boolean
    | Record<string, boolean | null | undefined>
  >
) => {
  const list = new Map<string, boolean>()

  const add = (name: string, active: boolean) => {
    name
      .trim()
      .split(' ')
      .forEach(className => {
        list.set(className, active)
      })
  }

  for (const arg of args) {
    if (!arg || typeof arg === 'boolean') {
      continue
    }

    if (typeof arg === 'string') {
      add(arg, true)
      continue
    }

    for (const [className, active] of Object.entries(arg)) {
      add(className, Boolean(active))
    }
    arg
  }

  return Object.fromEntries(list)
}
