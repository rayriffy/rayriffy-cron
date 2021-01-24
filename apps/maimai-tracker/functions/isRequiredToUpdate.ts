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

;(async () => {
  const click = target => document.querySelector(target).click()
  const wait = time => new Promise(res => setTimeout(res, time))

  click(
    '#table > div.viewBarContainer.baymax.flex > div.viewConfigContainer.flex-auto.flex.items-center > div > div.viewMenuPopover.relative > div > div'
  )
  click(
    '#table > div.viewBarContainer.baymax.flex > div.viewConfigContainer.flex-auto.flex.items-center > div > div.viewMenuPopover.relative > div.absolute.left-0 > ul > li:nth-child(4) > span'
  )

  await wait(100)

  click(
    '#hyperbaseContainer > div:nth-child(23) > div > div > div.dialog > div > div > div.flex.strong.huge.mb2 > div.mx1 > div > div > div.truncate.flex-auto.right-align'
  )
  click(
    'div.white.baymax.preventGridDeselect.rounded.stroked1 > ul > li:nth-child(1)'
  )
  click(
    '#hyperbaseContainer > div:nth-child(23) > div > div > div.dialog > div > div > div:nth-child(2) > label:nth-child(3) > div'
  )
  click(
    '#hyperbaseContainer > div:nth-child(23) > div > div > div.dialog > div > div > div:nth-child(2) > label:nth-child(4) > div'
  )
  click(
    '#hyperbaseContainer > div:nth-child(23) > div > div > div.dialog > div > div > div.flex.items-center.justify-end.mt2 > div.py1.px2.rounded.blue.pointer.link-quiet.blueDark1-focus.text-white.strong'
  )
})()
