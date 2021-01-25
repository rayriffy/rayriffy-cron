import Promise from 'bluebird'
import { TaskQueue } from 'cwait'

import { Browser } from 'puppeteer'

import { createPage } from '../functions/createPage'
import { reporter } from '../utils/reporter'
import { scroller } from '../utils/scroller'

import { Area } from '../@types/Area'

export const getAreas = async (
  browser: Browser,
  browserQueue: TaskQueue<typeof Promise>
) => {
  const page = await createPage(browser, browserQueue)()

  reporter.info('Reading area')

  // navigate to player data
  await page.goto('https://maimaidx-eng.com/maimai-mobile/map', {
    timeout: 0,
  })
  await page.waitForSelector('div.main_wrapper')
  await scroller(page)

  const payload = await page.$$eval<Area[]>(
    'div.main_wrapper > div.m_10.m_t_0.f_0',
    elements => {
      return elements.map(element => {
        const isCompleted = element.querySelector('img.map_comp_img') !== null
        const name =
          element.querySelector('div.map_name_block')?.textContent || ''
        const distanceRegex = (
          element.querySelector('div.basic_block')?.textContent || '0 m'
        ).match(/([\d.,]+) ([Km]+)/)

        const distanceNumber = Number(
          (distanceRegex || ['0', '0'])[1].split(',').join('')
        )
        const distanceUnit = (distanceRegex || [0, 0, 'm'])[2]

        return {
          Name: name,
          'Distance (Km)':
            distanceUnit === 'm' ? distanceNumber / 1000 : distanceNumber,
          Completed: isCompleted,
        }
      })
    }
  )

  await page.close()

  return payload
}
