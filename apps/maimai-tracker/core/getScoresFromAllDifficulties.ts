import { flatMapDeep } from 'lodash'
import Promise from 'bluebird'
import { TaskQueue } from 'cwait'

import { Browser } from 'puppeteer'
import scrollPageToBottom from 'puppeteer-autoscroll-down'

import { isPlaySSS } from '../functions/isPlaySSS'
import { isPlayFDX } from '../functions/isPlayFDX'
import { isPlayAP } from '../functions/isPlayAP'

import { GameGenre, GameVersion } from '../@types/Music'

interface Score {
  song: string
  difficulty: string
  version: GameVersion
  playData: {
      clear: boolean
      sss: boolean
      fdx: boolean
      ap: boolean
  } | null
}

export const getScoresFromAllDifficulties = async (browser: Browser) => {
  const page = await browser.newPage()
  
  console.log('navigate:version')
  await page.goto('https://maimaidx-eng.com/maimai-mobile/record/musicVersion/')
  await page.waitForSelector('select[name=version]')

  // get all available maimai versions
  const versions = await page.$$eval<{ text: GameVersion, value: string }[]>('select[name=version] > option', elements => {
    const typedElement = elements as HTMLOptionElement[]

    return typedElement.map(({textContent, value}) => ({
      text: (textContent === null ? '' : textContent) as GameVersion,
      value: value,
    }))
  })

  const difficulties = [
    { id: 0, code: 'EAS' },
    { id: 1, code: 'ADV' },
    { id: 2, code: 'EXP' },
    { id: 3, code: 'MAS' },
    { id: 4, code: 'REM' },
  ]

  // get all scores (limit to 1 version at a time)
  const queue = new TaskQueue(Promise, 1)
  const scoresFromAllDifficulties = await Promise.map(versions, queue.wrap<Score[][], { text: GameVersion, value: string }>(async version => {
    return await Promise.map(difficulties, async difficulty => {
      console.log(`process:${difficulty.code}:${version.text}`)

      try {
        const page = await browser.newPage()

        await page.goto(`https://maimaidx-eng.com/maimai-mobile/record/musicVersion/search/?version=${version.value}&diff=${difficulty.id}`)
        await page.waitForSelector('body > div.wrapper.main_wrapper.t_c > div.screw_block')

        await scrollPageToBottom(page, 300, 200)

        // todo: parse data
        const prefetchedData = await page.$$eval('body > div.wrapper.main_wrapper.t_c > *', elements => {
          const songElements = elements.filter(element => element.querySelector('div.music_name_block') !== null && element.querySelector('div.music_name_block') !== undefined)
          
          return songElements.map(element => ({
            song: element.querySelector('div.music_name_block')?.textContent ?? '',
            flagImages: element.querySelector('div.music_score_block') === null || element.querySelector('div.music_score_block') === undefined ? null : Array.from(element.querySelectorAll('img')).map(imageElement => imageElement.getAttribute('src'))
          }))
        })

        await page.close()

        return prefetchedData.map(item => {
          return {
            song: item.song,
            version: version.text,
            difficulty: difficulty.code,
            playData: item.flagImages === null ? null : {
              clear: true,
              sss: isPlaySSS(item.flagImages),
              fdx: isPlayFDX(item.flagImages),
              ap: isPlayAP(item.flagImages),
            }
          }
        })
      } catch (e) {
        console.error(`fail:${difficulty.code}:${version.text}`)
        throw e
      }
    })
  })).then(o => flatMapDeep(o))

  return scoresFromAllDifficulties
}