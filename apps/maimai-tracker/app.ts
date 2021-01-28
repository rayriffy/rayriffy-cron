import puppeteer from 'puppeteer'
import Promise from 'bluebird'
import { TaskQueue } from 'cwait'

import { reporter } from './utils/reporter'

import { getSongsWithGenre } from './core/getSongsWithGenre'
import { signIntoSEGA } from './core/signIntoSEGA'
import { getScoresFromAllDifficulties } from './core/getScoresFromAllDifficulties'
import { remoteScoresToAirtableFormat } from './core/remoteScoresToAirtableFormat'
import { syncWithAirtable } from './core/syncWithAirtable'
import { getPlayData } from './core/getPlayData'
import { getAreas } from './core/getAreas'
import { getTitles } from './core/getTitles'

// app entrypoint
import { remoteTitleToAirtableFormat } from './core/remoteTitleToAirtableFormat'
;(async () => {
  // open browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1280,
      height: 720,
    },
  })
  const browserQueue = new TaskQueue(Promise, 8)

  try {
    // fetch data from you, SEGA_ID and SEGA_PW required
    await signIntoSEGA(browser, browserQueue)
    const [
      areas,
      playData,
      songsWithGenre,
      scoresFromAllDifficulties,
      titles,
    ] = await Promise.all([
      getAreas(browser, browserQueue),
      getPlayData(browser, browserQueue),
      getSongsWithGenre(browser, browserQueue),
      getScoresFromAllDifficulties(browser, browserQueue),
      getTitles(browser, browserQueue),
    ])

    // process remote data into airtable fields
    const processedScores = remoteScoresToAirtableFormat(
      scoresFromAllDifficulties,
      songsWithGenre
    )

    // process title to airtable
    // const processedTitles = remoteTitleToAirtableFormat(titles)

    // sync with airtable
    await syncWithAirtable(processedScores, playData, areas, [])
  } catch (e) {
    reporter.fail('crash!')

    reporter.info('Printing error stack')
    console.error(e)

    process.exit(1)
  } finally {
    await browser.close()
  }
})()
