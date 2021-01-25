import { AxiosInstance } from 'axios'

import { formatAirtableRecord } from '../../functions/formatAirtableRecord'
import { getAllAirtableRecords } from '../../functions/getAllAirtableRecords'

import { reporter } from '../../utils/reporter'

import { PlayerData } from '../../@types/PlayerData'
import { formatPlayerData } from '../../functions/formatPlayerData'

export const syncPlayerData = async (
  processedPlayerData: PlayerData,
  airtableLimiter: <T>(fn: () => Promise<T>) => Promise<T>,
  airtableInstance: AxiosInstance
) => {
  /**
   * Player data
   */
  reporter.info('Reading player data from remote')
  const remoteRawPlayerDatas = await getAllAirtableRecords<PlayerData>(
    'Player data',
    airtableLimiter,
    airtableInstance
  )

  const remotePlayerDatas = remoteRawPlayerDatas.map(record =>
    formatAirtableRecord(record, formatPlayerData)
  )

  // if player data has not been added to the date yet, then create new record. otherwise, update data
  const targetPlayerData = remotePlayerDatas.find(
    o => o.fields.Timestamp === processedPlayerData.Timestamp
  )
  if (targetPlayerData === undefined) {
    await airtableLimiter(() =>
      airtableInstance.post('/Player data', {
        records: [
          {
            fields: processedPlayerData,
          },
        ],
      })
    )
    reporter.done('Added new player data')
  } else {
    const targetId = targetPlayerData.id

    await airtableLimiter(() =>
      airtableInstance.patch('/Player data', {
        records: [
          {
            id: targetId,
            fields: processedPlayerData,
          },
        ],
      })
    )
    reporter.done('Updated player data')
  }
}
