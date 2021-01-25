import { AxiosInstance } from 'axios'
import chalk from 'chalk'
import { chunk } from 'lodash'

import { formatAirtableRecord } from '../../functions/formatAirtableRecord'
import { getAllAirtableRecords } from '../../functions/getAllAirtableRecords'
import { formatArea } from '../../functions/formatArea'

import { reporter } from '../../utils/reporter'

import { Area } from '../../@types/Area'
import { locateArea } from '../../functions/locateArea'
import { isRequiredToUpdate } from '../../functions/isRequiredToUpdate'

export const syncAreas = async (
  processedAreas: Area[],
  airtableLimiter: <T>(fn: () => Promise<T>) => Promise<T>,
  airtableInstance: AxiosInstance
) => {
  /**
   * Player data
   */
  reporter.info('Reading areas from remote')
  const remoteRawAreas = await getAllAirtableRecords<Area>(
    'Area',
    airtableLimiter,
    airtableInstance
  )

  const remoteAreas = remoteRawAreas.map(record =>
    formatAirtableRecord(record, formatArea)
  )

  reporter.done(`Retrived ${chalk.green(remoteAreas.length)} areas!`)

  const areasPendingForRemoval = remoteAreas
    .map(remoteRecord => {
      const targetProcessedArea = locateArea(
        remoteRecord.fields.Name,
        processedAreas
      )

      // dump record id that need to delete
      if (targetProcessedArea === undefined) {
        return remoteRecord.id
      } else {
        return undefined
      }
    })
    .filter(o => o !== undefined) as string[]

  const areasPendingToAdd = processedAreas
    .map(area => {
      const targetRemoteArea = locateArea(
        area.Name,
        remoteAreas.map(o => o.fields)
      )

      if (targetRemoteArea === undefined) {
        return {
          fields: area,
        }
      } else {
        return undefined
      }
    })
    .filter(o => o !== undefined) as { fields: Area }[]

  const areasPendingToUpdate = remoteAreas
    .map(remoteRecord => {
      const targetProcessedArea = locateArea(
        remoteRecord.fields.Name,
        processedAreas
      )

      if (targetProcessedArea === undefined) {
        return undefined
      } else {
        // if object change, then request for update
        if (
          isRequiredToUpdate<keyof Area>(
            remoteRecord.fields,
            targetProcessedArea,
            ['Distance (Km)', 'Completed'],
            formatArea
          )
        ) {
          return {
            id: remoteRecord.id,
            fields: targetProcessedArea,
          }
        } else {
          return undefined
        }
      }
    })
    .filter(o => o !== undefined) as { id: string; fields: Area }[]

  try {
    // remove api
    if (areasPendingForRemoval.length !== 0) {
      reporter.info(
        `Removing ${chalk.blue(
          areasPendingForRemoval.length
        )} scores from remote`
      )
      const recordChunks = chunk(areasPendingForRemoval, 10)

      await Promise.all(
        recordChunks.map(async chunk => {
          return await airtableLimiter(() =>
            airtableInstance.delete('/Area', {
              params: {
                records: chunk,
              },
            })
          )
        })
      )
    }

    // update api
    if (areasPendingToUpdate.length !== 0) {
      reporter.info(
        `Updating ${chalk.blue(areasPendingToUpdate.length)} scores on remote`
      )
      const recordChunks = chunk(areasPendingToUpdate, 10)

      await Promise.all(
        recordChunks.map(async chunk => {
          return await airtableLimiter(() =>
            airtableInstance.patch('/Area', {
              records: chunk,
            })
          )
        })
      )
    }

    // create api
    if (areasPendingToAdd.length !== 0) {
      reporter.info(
        `Adding ${chalk.blue(areasPendingToAdd.length)} scores to remote`
      )
      const recordChunks = chunk(areasPendingToAdd, 10)

      await Promise.all(
        recordChunks.map(async chunk => {
          return await airtableLimiter(() =>
            airtableInstance.post('/Area', {
              records: chunk,
            })
          )
        })
      )
    }

    if (
      areasPendingForRemoval.length === 0 &&
      areasPendingToAdd.length === 0 &&
      areasPendingToUpdate.length === 0
    ) {
      reporter.info('Area already up-to-date!')
    }
  } catch (e) {
    throw e.response.data
  }
}
