export const isEqual = (obj1: object, obj2: object) => {
  const obj1Keys = Object.keys(obj1)
  const obj2Keys = Object.keys(obj2)

  return (
    obj1Keys.length === obj2Keys.length &&
    obj1Keys.every(
      (key) => (obj1 as Record<string, unknown>)[key] === (obj2 as Record<string, unknown>)[key],
    )
  )
}
