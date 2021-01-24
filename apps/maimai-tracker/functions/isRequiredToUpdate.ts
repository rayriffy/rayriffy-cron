import { flatMap, get, isEqual } from 'lodash'

import { difficulties } from '../constants/difficulties'
import { formatAirtableRecord } from './formatAirtableRecord'
import { formatMusic } from './formatMusic'

import { Music } from '../@types/Music'

export const isRequiredToUpdate = (
  sourceMusic: Music,
  compareWithMusic: Music
) => {
  const optionsToCompare = [
    'Progress',
    'Level',
    'CL',
    '100%',
    'FC',
    'AP',
    'FDX',
  ]

  const allKeysNeedToCompare = flatMap(
    difficulties.map(difficulty =>
      optionsToCompare.map(option => `${difficulty.code} - ${option}`)
    )
  )

  // if false included in compare, means value not match and need to be updated
  const compareResult = allKeysNeedToCompare
    .map(key => {
      const sourceValue = get(formatMusic(sourceMusic), key)
      const compareValue = get(formatMusic(compareWithMusic), key)

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
