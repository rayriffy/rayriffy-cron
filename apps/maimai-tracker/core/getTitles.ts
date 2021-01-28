import Promise from 'bluebird'
import { TaskQueue } from 'cwait'

import { Browser } from 'puppeteer'
import { uniq } from 'lodash'

import { createPage } from '../functions/createPage'
import { reporter } from '../utils/reporter'
import { scroller } from '../utils/scroller'

export const getTitles = async (
  browser: Browser,
  browserQueue: TaskQueue<typeof Promise>
) => {
  const page = await createPage(browser, browserQueue)()

  reporter.info('Reading titles')

  await page.goto('https://maimaidx-eng.com/maimai-mobile/collection/trophy', {
    timeout: 0,
  })
  await page.waitForSelector('div.main_wrapper')
  await scroller(page)

  const payload = await page.$$eval<string[]>(
    'div.trophy_inner_block',
    elements => {
      return elements.map(element => element.textContent || '')
    }
  )

  await page.close()

  return uniq(payload)
}
