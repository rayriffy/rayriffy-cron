import axios from 'axios'
import { uniq } from 'lodash'

import { pRateLimit } from 'p-ratelimit'

import { reporter } from '../../utils/reporter'

import { syncScores } from './syncScores'
import { syncPlayerData } from './syncPlayerData'
import { syncAreas } from './syncAreas'
import { syncTitle } from './syncTitle'
import { getAirtableBaseId } from '../../functions/getAirtableBaseId'

import { Music } from '../../@types/Music'
import { PlayerData } from '../../@types/PlayerData'
import { Area } from '../../@types/Area'
import { AirtableBaseData } from '../../@types/AirtableBaseData'
import { Title } from '../../@types/Title'

const { AIRTABLE_API_KEY } = process.env

export const syncWithAirtable = async (
  processedMusics: Music[],
  processedPlayerData: PlayerData,
  processedAreas: Area[],
  processedTitles: Title[]
) => {
  console.log(uniq(processedMusics.map(o => o.Genre)))
  // get all airtable records
  const airtableLimiter = pRateLimit({
    interval: 1000,
    rate: 5,
  })
  const airtableInstance = (id: keyof AirtableBaseData) =>
    axios.create({
      baseURL: `https://api.airtable.com/v0/${getAirtableBaseId(id)}`,
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    })

  try {
  await Promise.all([
    syncScores(processedMusics, airtableLimiter, airtableInstance('score')),
    syncPlayerData(
      processedPlayerData,
      airtableLimiter,
      airtableInstance('playData')
    ),
    syncAreas(processedAreas, airtableLimiter, airtableInstance('area')),
    // syncTitle(processedTitles, airtableLimiter, airtableInstance('title')),
  ])
  } catch (e) {
    reporter.fail("Failed to sync data with following message")
    console.log(e.response.data)

    throw new Error("sync-fail")
  }

  reporter.done('Remote table synced!')
}
