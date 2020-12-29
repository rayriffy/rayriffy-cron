import fs from 'fs'
import { flatMapDeep } from 'lodash'
import Promise from 'bluebird'
import { TaskQueue } from 'cwait'

import { Browser } from 'puppeteer'
import scrollPageToBottom from 'puppeteer-autoscroll-down'

import { isPlaySSS } from '../functions/isPlaySSS'
import { isPlayFDX } from '../functions/isPlayFDX'
import { isPlayAP } from '../functions/isPlayAP'
import { isPlayFC } from '../functions/isPlayFC'
import { difficulties, Difficulty } from '../constants/difficulties'
import { reporter } from '../utils/reporter'
import { chalk } from '../utils/chalk'

import { GameVersion } from '../@types/Music'
import { fstat } from 'fs'

export interface Score {
  song: string
  difficulty: Difficulty['code']
  version: GameVersion
  playData: {
    clear: boolean
    sss: boolean
    fdx: boolean
    ap: boolean
    fc: boolean
  } | null
}

interface InternalFunctionVersion {
  text: GameVersion
  value: string
}

export const getScoresFromAllDifficulties = async (
  browser: Browser,
  browserQueue: TaskQueue<typeof Promise>
) => {
  const page = await browser.newPage()

  reporter.info('Listing all maimai versions')

  await page.goto('https://maimaidx-eng.com/maimai-mobile/record/musicVersion/')
  await page.waitForSelector('select[name=version]')

  // get all available maimai versions
  const versions = await page.$$eval<InternalFunctionVersion[]>(
    'select[name=version] > option',
    elements => {
      const typedElement = elements as HTMLOptionElement[]

      return typedElement.map(({ textContent, value }) => ({
        text: (textContent === null ? '' : textContent) as GameVersion,
        value: value,
      }))
    }
  )

  await page.close()

  reporter.done(`Listed ${chalk.green(versions.length)} version!`)

  // get all scores (limit to 1 version at a time)
  const allPossibleCombination = flatMapDeep(
    versions.map(version =>
      difficulties.map(difficulty => ({
        version,
        difficulty,
      }))
    )
  )

  // const queue = new TaskQueue(Promise, 8)
  const scoresFromAllDifficulties = await Promise.all(
    allPossibleCombination.map(
      browserQueue.wrap<
        Score[],
        { version: InternalFunctionVersion; difficulty: Difficulty }
      >(async ({ version, difficulty }) => {
        reporter.info(
          `Reading scores from ${chalk.blue(version.text)} with ${chalk.blue(
            difficulty.name
          )} difficulty`
        )

        const page = await browser.newPage()

        try {
          await page.goto(
            `https://maimaidx-eng.com/maimai-mobile/record/musicVersion/search/?version=${version.value}&diff=${difficulty.id}`
          )
          await page.waitForSelector('div.main_wrapper.t_c')

          await scrollPageToBottom(page, 300, 200)

          // todo: parse data
          const prefetchedData = await page.$$eval(
            'div.main_wrapper.t_c > *',
            elements => {
              const songElements = elements.filter(
                element =>
                  element.querySelector('div.music_name_block') !== null &&
                  element.querySelector('div.music_name_block') !== undefined
              )

              return songElements.map(element => ({
                song:
                  element.querySelector('div.music_name_block')?.textContent ??
                  '',
                flagImages:
                  element.querySelector('div.music_score_block') === null ||
                  element.querySelector('div.music_score_block') === undefined
                    ? null
                    : Array.from(
                        element.querySelectorAll('img')
                      ).map(imageElement => imageElement.getAttribute('src')),
              }))
            }
          )

          return prefetchedData.map(item => {
            return {
              song: item.song,
              version: version.text,
              difficulty: difficulty.code,
              playData:
                item.flagImages === null
                  ? null
                  : {
                      clear: true,
                      sss: isPlaySSS(item.flagImages),
                      fdx: isPlayFDX(item.flagImages),
                      ap: isPlayAP(item.flagImages),
                      fc: isPlayFC(item.flagImages),
                    },
            }
          })
        } catch (e) {
          reporter.fail(
            `Unable to obtain scores from ${chalk.red(
              version.text
            )} with ${chalk.red(difficulty.name)} difficulty`
          )

          const screenshot = await page.screenshot({
            type: 'jpeg',
            fullPage: true,
          })

          if (!fs.existsSync('dist')) {
            fs.mkdirSync('dist')
          }

          fs.writeFileSync(
            `dist/version-${version.text}-${difficulty.name}.jpg`,
            screenshot
          )

          reporter.done(
            `Screenshot has been captured for ${chalk.green(
              version.text
            )} with ${chalk.green(difficulty.name)} difficulty`
          )

          throw e
        } finally {
          await page.close()
        }
      })
    )
  ).then(o => flatMapDeep(o))

  reporter.done(
    `Obtained ${chalk.green(scoresFromAllDifficulties.length)} scores!`
  )

  return scoresFromAllDifficulties
}
