import axios from 'axios'

import { pRateLimit } from 'p-ratelimit'

import { reporter } from '../../utils/reporter'

import { syncScores } from './syncScores'
import { syncPlayerData } from './syncPlayerData'
import { syncAreas } from './syncAreas'
import { getAirtableBaseId } from '../../functions/getAirtableBaseId'

import { Music } from '../../@types/Music'
import { PlayerData } from '../../@types/PlayerData'
import { Area } from '../../@types/Area'
import { AirtableBaseData } from '../../@types/AirtableBaseData'

const { AIRTABLE_API_KEY } = process.env

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
  const airtableInstance = (id: keyof AirtableBaseData) =>
    axios.create({
      baseURL: `https://api.airtable.com/v0/${getAirtableBaseId(id)}`,
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    })

  await Promise.all([
    syncScores(processedMusics, airtableLimiter, airtableInstance('score')),
    syncPlayerData(
      processedPlayerData,
      airtableLimiter,
      airtableInstance('playData')
    ),
    syncAreas(processedAreas, airtableLimiter, airtableInstance('area')),
  ])

  reporter.done('Remote table synced!')
}
