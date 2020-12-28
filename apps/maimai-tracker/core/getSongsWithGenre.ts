import { flatMap } from 'lodash'
import Promise from 'bluebird'

import { Browser } from 'puppeteer'
import scrollPageToBottom from 'puppeteer-autoscroll-down'

import { GameGenre } from '../@types/Music'

export const getSongsWithGenre = async (browser: Browser) => {
    const page = await browser.newPage()

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
    const songsWithGenre = await Promise.map(genres, async genre => {
      console.log(`songsWithGenre:${genre.text}`)
  
      const page = await browser.newPage()
  
      await page.goto(`https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=${genre.value}&diff=0`)
      await page.waitForSelector('body > div.wrapper.main_wrapper.t_c > div.screw_block')
  
      await scrollPageToBottom(page, 300, 200)
  
      // featch all songs
      const songs = await page.$$eval('body > div.wrapper.main_wrapper.t_c > *', elements => {
        // filter only valid ones
        const validElements = elements.filter(element => element.querySelector('div.music_name_block') !== null && element.querySelector('div.music_name_block') !== undefined).map(element => element.querySelector('div.music_name_block')?.textContent ?? '')
  
        return validElements
      })
  
      await page.close()
  
      return songs.map(song => ({
        name: song,
        genre: genre.text,
      }))
    }).then(o => flatMap(o))

    await page.close()

    return songsWithGenre
}
