import { flatMap, get, isEqual } from 'lodash'

import { difficulties } from '../constants/difficulties'

import { Music } from '../@types/Music'

export const isRequiredToUpdate = (
  sourceMusic: Music,
  compareWithMusic: Music
) => {
  const optionsToCompare = ['Progress', 'CL', '100%', 'FC', 'AP', 'FDX']

  const allKeysNeedToCompare = flatMap(
    difficulties.map(difficulty =>
      optionsToCompare.map(option => `${difficulty.code} - ${option}`)
    )
  )

  // if false included in compare, means value not match and need to be updated
  const compareResult = allKeysNeedToCompare
    .map(key => {
      const sourceValue = get(sourceMusic, key)
      const compareValue = get(compareWithMusic, key)

      return sourceValue === compareValue
    })
    .includes(false)

  return compareResult
}
