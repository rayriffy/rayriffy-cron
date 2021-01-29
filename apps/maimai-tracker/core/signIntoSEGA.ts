import Promise from 'bluebird'
import { TaskQueue } from 'cwait'
import fs from 'fs'
import chalk from 'chalk'

import { Browser } from 'puppeteer'
import { createPage } from '../functions/createPage'

import { reporter } from '../utils/reporter'

const { SEGA_ID, SEGA_PW } = process.env

const wait = (time: number) => new Promise(res => setTimeout(() => res(), time))

export const signIntoSEGA = async (
  browser: Browser,
  browserQueue: TaskQueue<typeof Promise>
) => {
  reporter.info('Signing into maimai NET')

  // entrypoint
  const page = await createPage(browser, browserQueue)()
  await page.goto('https://maimaidx-eng.com/')

  try {
    // click login with sega id
    await page.waitForSelector('span.c-button--openid--segaId')
    await page.click('span.c-button--openid--segaId')

    await wait(1000)

    // fill credentials
    reporter.info('Filling credentials')
    await page.waitForSelector('#sid')
    await page.type('#sid', SEGA_ID || '')

    await page.waitForSelector('#password')
    await page.type('#password', SEGA_PW || '')

    // login
    await page.waitForSelector('#btnSubmit')
    await page.click('#btnSubmit')

    // wait until profile picture to show
    await page.waitForSelector(
      'body > div.wrapper.main_wrapper.t_c > div.see_through_block.m_15.m_t_0.p_10.p_r.t_l.f_0 > div.basic_block.p_10.p_b_5.f_0 > img'
    )
    await page.close()

    reporter.done('Signed in!')
  } catch (e) {
    const screenshot = await page.screenshot({
      type: 'jpeg',
      fullPage: true,
    })

    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist')
    }

    fs.writeFileSync(`dist/signIntoSEGA.jpg`, screenshot)

    reporter.done(
      `Screenshot has been captured for ${chalk.green('signIntoSEGA')}`
    )

    const isMaintenance = await page.$eval(
      'body > div:nth-child(3) > div > div.sub_info',
      element => (element?.textContent ?? '').includes('under maintenance')
    )

    if (isMaintenance) {
      reporter.fail('Server is under maintenance')
      throw 'under-maintenance'
    } else {
      throw e
    }
  }
}
