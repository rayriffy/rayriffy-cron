import puppeteer from 'puppeteer'

import { getSongsWithGenre } from './core/getSongsWithGenre'
import { signIntoSEGA } from './core/signIntoSEGA'
import { getScoresFromAllDifficulties } from './core/getScoresFromAllDifficulties'
import { remoteScoresToAirtableFormat } from './core/remoteScoresToAirtableFormat'
import { syncWithAirtable } from './core/syncWithAirtable'
;(async () => {
  // open browser
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1280,
      height: 720,
    },
  })
  // fetch data from you, SEGA_ID and SEGA_PW required
  await signIntoSEGA(browser)
  const [songsWithGenre, scoresFromAllDifficulties] = await Promise.all([
    getSongsWithGenre(browser),
    getScoresFromAllDifficulties(browser),
  ])

  // process and sync with airtable
  await syncWithAirtable(
    remoteScoresToAirtableFormat(scoresFromAllDifficulties, songsWithGenre)
  )
})()
