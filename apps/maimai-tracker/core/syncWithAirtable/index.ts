import axios from 'axios'

import { pRateLimit } from 'p-ratelimit'

import { reporter } from '../../utils/reporter'

import { syncScores } from './syncScores'
import { syncPlayerData } from './syncPlayerData'
import { syncAreas } from './syncAreas'

import { Music } from '../../@types/Music'
import { PlayerData } from '../../@types/PlayerData'
import { Area } from '../../@types/Area'

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env

export const syncWithAirtable = async (
  processedMusics: Music[],
  processedPlayerData: PlayerData,
  processedAreas: Area[]
) => {
  // get all airtable records
  const airtableLimiter = pRateLimit({
    interval: 1000,
    rate: 5,
  })
  const airtableInstance = axios.create({
    baseURL: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`,
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
  })

  await Promise.all([
    syncScores(processedMusics, airtableLimiter, airtableInstance),
    syncPlayerData(processedPlayerData, airtableLimiter, airtableInstance),
    syncAreas(processedAreas, airtableLimiter, airtableInstance),
  ])

  reporter.done('Remote table synced!')
}
