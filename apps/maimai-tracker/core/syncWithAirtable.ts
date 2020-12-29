import axios from 'axios'

import { pRateLimit } from 'p-ratelimit'
import { chunk, isEqual } from 'lodash'

import { formatAirtableRecord } from '../functions/formatAirtableRecord'
import { locateMusic } from '../functions/locateMusic'
import { getAllAirtableRecords } from '../functions/getAllAirtableRecords'
import { isRequiredToUpdate } from '../functions/isRequiredToUpdate'

import { reporter } from '../utils/reporter'
import { chalk } from '../utils/chalk'

import { Music } from '../@types/Music'

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = process.env

export const syncWithAirtable = async (processedMusics: Music[]) => {
  // get all airtable records
  const airtableLimiter = pRateLimit({
    interval: 1000,
    rate: 5,
  })
  const airtableInstance = axios.create({
    baseURL: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`,
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
  })

  reporter.info('Reading records from remote')
  const remoteRawRecords = await getAllAirtableRecords(
    airtableLimiter,
    airtableInstance
  )

  const remoteRecords = remoteRawRecords.map(record =>
    formatAirtableRecord(record)
  )

  reporter.done(`Retrived ${chalk.green(remoteRawRecords.length)} records!`)

  reporter.info('Diffing data...')

  // clean data for removed music (in case of version upgrade)
  // condition met when data in remote present but not in processed data
  const recordsPendingForRemoval = remoteRecords
    .map(remoteRecord => {
      const targetProcessedMusic = locateMusic(
        remoteRecord.fields.Name,
        remoteRecord.fields.Version,
        processedMusics
      )

      // dump record id that need to delete
      if (targetProcessedMusic === undefined) {
        return remoteRecord.id
      } else {
        return undefined
      }
    })
    .filter(o => o !== undefined) as string[]

  // new data that needs to be added
  // condition met when data is not present in remote but present in processed data
  const recordsPendingToAdd = processedMusics
    .map(music => {
      const targetRemoteMusic = locateMusic(
        music.Name,
        music.Version,
        remoteRecords.map(o => o.fields)
      )

      if (targetRemoteMusic === undefined) {
        return {
          fields: music,
        }
      } else {
        return undefined
      }
    })
    .filter(o => o !== undefined) as { fields: Music }[]

  // data that requires to be updated
  // condition when record both presented in remote and processed data, and fields is different
  const recordsPendingToUpdate = remoteRecords
    .map(remoteRecord => {
      const targetProcessedMusic = locateMusic(
        remoteRecord.fields.Name,
        remoteRecord.fields.Version,
        processedMusics
      )

      if (targetProcessedMusic === undefined) {
        return undefined
      } else {
        // if object change, then request for update
        if (isRequiredToUpdate(remoteRecord.fields, targetProcessedMusic)) {
          return {
            id: remoteRecord.id,
            fields: targetProcessedMusic,
          }
        } else {
          return undefined
        }
      }
    })
    .filter(o => o !== undefined) as { id: string; fields: Music }[]

  try {
    // remove api
    if (recordsPendingForRemoval.length !== 0) {
      reporter.info(
        `Removing ${chalk.blue(
          recordsPendingForRemoval.length
        )} records from remote`
      )
      const recordChunks = chunk(recordsPendingForRemoval, 10)

      await Promise.all(
        recordChunks.map(async chunk => {
          return await airtableLimiter(() =>
            airtableInstance.delete('/', {
              params: {
                records: chunk,
              },
            })
          )
        })
      )
    }

    // update api
    if (recordsPendingToUpdate.length !== 0) {
      reporter.info(
        `Updating ${chalk.blue(
          recordsPendingToUpdate.length
        )} records on remote`
      )
      const recordChunks = chunk(recordsPendingToUpdate, 10)

      await Promise.all(
        recordChunks.map(async chunk => {
          return await airtableLimiter(() =>
            airtableInstance.patch('/', {
              records: chunk,
            })
          )
        })
      )
    }

    // create api
    if (recordsPendingToAdd.length !== 0) {
      reporter.info(
        `Adding ${chalk.blue(recordsPendingToAdd.length)} records to remote`
      )
      const recordChunks = chunk(recordsPendingToAdd, 10)

      await Promise.all(
        recordChunks.map(async chunk => {
          return await airtableLimiter(() =>
            airtableInstance.post('/', {
              records: chunk,
            })
          )
        })
      )
    }

    if (
      recordsPendingForRemoval.length === 0 &&
      recordsPendingToAdd.length === 0 &&
      recordsPendingToUpdate.length === 0
    ) {
      reporter.info('Already up-to-date!')
    }

    reporter.done('Remote table synced!')
  } catch (e) {
    throw e
  }
}
