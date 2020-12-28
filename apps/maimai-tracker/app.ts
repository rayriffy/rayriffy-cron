import axios from 'axios'
import fs from 'fs'

import puppeteer from 'puppeteer'
import scrollPageToBottom from 'puppeteer-autoscroll-down'

import Promise from 'bluebird'
import { PromisyClass, TaskQueue } from 'cwait'
import { pRateLimit } from 'p-ratelimit'

import { flatMap } from 'lodash'

import { GameGenre } from './@types/Music'

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

const wait = (time: number) => new Promise(res => setTimeout(() => res(), time))


;(async () => {
  // open browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1280,
      height: 720,
    },
  })

  // entrypoint
  console.log('entry')
  const page = await browser.newPage()
  await page.goto('https://maimaidx-eng.com/')

  // click login with sega id
  await page.waitForSelector('span.c-button--openid--segaId')
  await page.click('span.c-button--openid--segaId')
  
  await wait(1000)
  
  // fill credentials
  console.log('login:fill')
  await page.waitForSelector('#sid')
  await page.type('#sid', SEGA_ID || '')

  await page.waitForSelector('#password')
  await page.type('#password', SEGA_PW || '')

  // login
  await page.waitForSelector('#btnSubmit')
  await page.click('#btnSubmit')

  await page.waitForNavigation({
    waitUntil: 'networkidle2'
  })

  // navigate to song score
  console.log('navgate:score')
  await page.goto('https://maimaidx-eng.com/maimai-mobile/record/musicGenre')

  // wait for select option avil and then query
  await page.waitForSelector('select[name=genre]')

  console.log('process:genres')
  // get all options
  const genres = await page.$$eval<{ text: GameGenre, value: string }[]>('select[name=genre] > option', elements => {
    const typedElement = elements as HTMLOptionElement[]

    return typedElement.map(({textContent, value}) => ({
      text: (textContent === null ? '' : textContent) as GameGenre | 'All genre',
      value: value,
    })).filter(item => item.text !== 'All genre') as any
  })

  // get song per page (only do one at a time)
  const queue = new TaskQueue(Promise, 5)
  const songsWithGenre = await Promise.map(genres, queue.wrap<{ genre: GameGenre, name: string }[], { text: GameGenre, value: string }>(async genre => {
    console.log('processing', genre.text)

    const page = await browser.newPage()

    await page.goto(`https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=${genre.value}&diff=0`)

    // await page.select('select[name=genre]', genre.value)
    // await page.click('body > div.wrapper.main_wrapper.t_c > div:nth-child(4) > div > form > div > button:nth-child(1)')

    await page.waitForSelector('body > div.wrapper.main_wrapper.t_c > div.screw_block')

    await scrollPageToBottom(page, 200, 300)

    // featch all songs
    const songs = await page.$$eval('body > div.wrapper.main_wrapper.t_c > *', elements => {
      // filter only valid ones
      const validElements = elements.filter(element => element.querySelector('div.music_name_block') !== null || element.querySelector('div.music_name_block') !== undefined).map(element => element.querySelector('div.music_name_block')?.textContent ?? '')

      return validElements
    })

    return songs.map(song => ({
      name: song,
      genre: genre.text,
    }))
  })).then(o => flatMap(o).filter(o => o.name !== ''))

  // navigate to song version
  // await page.goto('https://maimaidx-eng.com/maimai-mobile/record/musicVersion/', )
  console.log(songsWithGenre)
  fs.writeFileSync('out.json', JSON.stringify(songsWithGenre))
})()
