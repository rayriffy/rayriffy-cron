import { AxiosInstance } from 'axios'
import chalk from 'chalk'
import { chunk } from 'lodash'

import { reporter } from '../../utils/reporter'
import { getAllAirtableRecords } from '../../functions/getAllAirtableRecords'
import { formatTitle } from '../../functions/formatTitle'
import { formatAirtableRecord } from '../../functions/formatAirtableRecord'
import { locateTitle } from '../../functions/locateTitle'

import { Title } from '../../@types/Title'
import { isRequiredToUpdate } from '../../functions/isRequiredToUpdate'

export const syncTitle = async (
  processedTitles: Title[],
  airtableLimiter: <T>(fn: () => Promise<T>) => Promise<T>,
  airtableInstance: AxiosInstance
) => {
  reporter.info('Reading areas from remote')
  const remoteRawTitles = await getAllAirtableRecords<Title>(
    'Title',
    airtableLimiter,
    airtableInstance
  )

  const remoteTitles = remoteRawTitles.map(record =>
    formatAirtableRecord(record, formatTitle)
  )

  reporter.done(`Retrived ${chalk.green(remoteTitles.length)} titles!`)

  const titlesPendingForRemoval = remoteTitles
    .map(remoteRecord => {
      const targetProcessedArea = locateTitle(
        remoteRecord.fields.Name,
        processedTitles
      )

      // dump record id that need to delete
      if (targetProcessedArea === undefined) {
        return remoteRecord.id
      } else {
        return undefined
      }
    })
    .filter(o => o !== undefined) as string[]

  const titlesPendingToAdd = processedTitles
    .map(area => {
      const targetRemoteArea = locateTitle(
        area.Name,
        remoteTitles.map(o => o.fields)
      )

      if (targetRemoteArea === undefined) {
        return {
          fields: area,
        }
      } else {
        return undefined
      }
    })
    .filter(o => o !== undefined) as { fields: Title }[]

  const titlesPendingToUpdate = remoteTitles
    .map(remoteRecord => {
      const targetProcessedTitle = locateTitle(
        remoteRecord.fields.Name,
        processedTitles
      )

      if (targetProcessedTitle === undefined) {
        return undefined
      } else {
        // if object change, then request for update
        if (
          isRequiredToUpdate<keyof Title>(
            remoteRecord.fields,
            targetProcessedTitle,
            ['Name', 'Condition', 'Rarity', 'Obtained'],
            formatTitle
          )
        ) {
          return {
            id: remoteRecord.id,
            fields: targetProcessedTitle,
          }
        } else {
          return undefined
        }
      }
    })
    .filter(o => o !== undefined) as { id: string; fields: Title }[]

  try {
    // remove api
    if (titlesPendingForRemoval.length !== 0) {
      reporter.info(
        `Removing ${chalk.blue(
          titlesPendingForRemoval.length
        )} titles from remote`
      )
      const recordChunks = chunk(titlesPendingForRemoval, 10)

      await Promise.all(
        recordChunks.map(async chunk => {
          return await airtableLimiter(() =>
            airtableInstance.delete('/Title', {
              params: {
                records: chunk,
              },
            })
          )
        })
      )
    }

    // update api
    if (titlesPendingToUpdate.length !== 0) {
      reporter.info(
        `Updating ${chalk.blue(titlesPendingToUpdate.length)} titles on remote`
      )
      const recordChunks = chunk(titlesPendingToUpdate, 10)

      await Promise.all(
        recordChunks.map(async chunk => {
          return await airtableLimiter(() =>
            airtableInstance.patch('/Title', {
              records: chunk,
            })
          )
        })
      )
    }

    // create api
    if (titlesPendingToAdd.length !== 0) {
      reporter.info(
        `Adding ${chalk.blue(titlesPendingToAdd.length)} titles to remote`
      )
      const recordChunks = chunk(titlesPendingToAdd, 10)

      await Promise.all(
        recordChunks.map(async chunk => {
          return await airtableLimiter(() =>
            airtableInstance.post('/Title', {
              records: chunk,
            })
          )
        })
      )
    }

    if (
      titlesPendingForRemoval.length === 0 &&
      titlesPendingToAdd.length === 0 &&
      titlesPendingToUpdate.length === 0
    ) {
      reporter.info('Titles already up-to-date!')
    }
  } catch (e) {
    throw e.response.data
  }
}
