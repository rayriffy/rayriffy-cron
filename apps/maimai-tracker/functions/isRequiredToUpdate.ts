import { get } from 'lodash'

export const isRequiredToUpdate = <P extends string, T = unknown>(
  sourceData: T,
  compareWithData: T,
  optionsToCompare: P[],
  normalizeFunction: (input: Partial<T>) => T
) => {
  // if false included in compare, means value not match and need to be updated
  const compareResult = optionsToCompare
    .map(key => {
      const sourceValue = get(normalizeFunction(sourceData), key)
      const compareValue = get(normalizeFunction(compareWithData), key)

      const isDiff = sourceValue !== compareValue

      // if (isDiff)
      //   console.log(key ,' :: ', sourceValue, `<->`, compareValue)

      if (isDiff) {
        return key
      } else {
        return undefined
      }
    })
    .filter(o => o !== undefined)

  return compareResult.length !== 0
}
