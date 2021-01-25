import moment from 'moment'
import Promise from 'bluebird'
import { TaskQueue } from 'cwait'

import { Browser } from 'puppeteer'

import { reporter } from '../utils/reporter'
import { createPage } from '../functions/createPage'

export const getPlayData = async (
  browser: Browser,
  browserQueue: TaskQueue<typeof Promise>
) => {
  const page = await createPage(browser, browserQueue)()

  reporter.info('Reading metadata')

  // navigate to player data
  await page.goto('https://maimaidx-eng.com/maimai-mobile/playerData', {
    timeout: 0,
  })
  await page.waitForSelector('div.main_wrapper')

  // read
  const payload = await page.$eval(
    'body > div.wrapper.main_wrapper.t_c > div.see_through_block.m_15.m_t_0.p_10.p_r.t_l.f_0',
    element => {
      const getStatFromTarget = (child: number, position = 0) =>
        Number(
          (
            element.querySelector(
              `div:nth-child(${child}) > div.musiccount_counter_block.f_13`
            )?.textContent || '0'
          )
            .split('/')
            [position].split(',')
            .join('')
        )

      return {
        'Deluxe rating': Number(
          element.querySelector(
            'div.basic_block.p_10.p_b_5.f_0 > div.p_l_10.f_l > div:nth-child(2) > div.f_r.t_r.f_0 > div.p_r.p_3 > div'
          )?.textContent
        ),
        'Play count': Number(
          ((
            element.querySelector('div.m_5.m_t_10.t_r.f_12')?.textContent || '0'
          ).match(/(\d+)/) || ['0'])[0] || '0'
        ),
        'Total tracks': getStatFromTarget(4, 1),
        'SSS+': getStatFromTarget(4),
        'AP+': getStatFromTarget(5),
        SSS: getStatFromTarget(7),
        AP: getStatFromTarget(8),
        'SS+': getStatFromTarget(10),
        'FC+': getStatFromTarget(11),
        SS: getStatFromTarget(13),
        FC: getStatFromTarget(14),
        'S+': getStatFromTarget(16),
        'FDX+': getStatFromTarget(17),
        S: getStatFromTarget(19),
        FDX: getStatFromTarget(20),
        Clear: getStatFromTarget(22),
        'FS+': getStatFromTarget(23),
        '5 DX star': getStatFromTarget(25),
        FS: getStatFromTarget(26),
        '4 DX star': getStatFromTarget(28),
        '3 DX star': getStatFromTarget(30),
        '2 DX star': getStatFromTarget(32),
        '1 DX star': getStatFromTarget(34),
      }
    }
  )

  await page.close()

  return {
    Timestamp: moment().format('YYYY-MM-DD'),
    ...payload,
  }
}
