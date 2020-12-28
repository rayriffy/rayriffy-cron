import axios from 'axios'
import fs from 'fs'

import puppeteer from 'puppeteer'

import { pRateLimit } from 'p-ratelimit'

import { getSongsWithGenre } from './core/getSongsWithGenre'
import { signIntoSEGA } from './core/signIntoSEGA'
import { getScoresFromAllDifficulties } from './core/getScoresFromAllDifficulties'

const { AIRTABLE_API_KEY, SEGA_ID, SEGA_PW } = process.env

const airtableLimiter = pRateLimit({
  interval: 1000,
  rate: 5,
  // concurrency: 5,
})

const airtableInstance = axios.create({
  baseURL: 'https://api.airtable.com/v0/appbz5pBuSREdpNIz/Progress%20tracker',
  headers: {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`
  }
})

;(async () => {
  // open browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1280,
      height: 720,
    },
  })

  await signIntoSEGA(browser)

  const songsWithGenre = await getSongsWithGenre(browser)
  const scoresFromAllDifficulties = await getScoresFromAllDifficulties(browser)
  
  // navigate to song version

  console.log('out:writeFile')
  fs.writeFileSync('scoresFromAllDifficulties.json', JSON.stringify(scoresFromAllDifficulties))
  fs.writeFileSync('songsWithGenre.json', JSON.stringify(songsWithGenre))
})()
