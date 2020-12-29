import puppeteer from 'puppeteer'
import Promise from 'bluebird'
import { TaskQueue } from 'cwait'

import { reporter } from './utils/reporter'

import { getSongsWithGenre } from './core/getSongsWithGenre'
import { signIntoSEGA } from './core/signIntoSEGA'
import { getScoresFromAllDifficulties } from './core/getScoresFromAllDifficulties'
import { remoteScoresToAirtableFormat } from './core/remoteScoresToAirtableFormat'
import { syncWithAirtable } from './core/syncWithAirtable'

// app entrypoint
;(async () => {
  // open browser
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1280,
      height: 720,
    },
  })
  const browserQueue = new TaskQueue(Promise, 16)

  try {
    // fetch data from you, SEGA_ID and SEGA_PW required
    await signIntoSEGA(browser)
    const [songsWithGenre, scoresFromAllDifficulties] = await Promise.all([
      getSongsWithGenre(browser, browserQueue),
      getScoresFromAllDifficulties(browser, browserQueue),
    ])

    // process and sync with airtable
    await syncWithAirtable(
      remoteScoresToAirtableFormat(scoresFromAllDifficulties, songsWithGenre)
    )
  } catch (e) {
    reporter.fail('crash!')

    reporter.info('Printing error stack')
    console.error(e)

    process.exit(1)
  } finally {
    await browser.close()
  }
})()
