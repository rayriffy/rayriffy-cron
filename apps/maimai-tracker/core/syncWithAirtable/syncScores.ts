import { AxiosInstance } from 'axios'
import { chunk, flatMap } from 'lodash'

import { formatAirtableRecord } from '../../functions/formatAirtableRecord'
import { locateMusic } from '../../functions/locateMusic'
import { getAllAirtableRecords } from '../../functions/getAllAirtableRecords'
import { isRequiredToUpdate } from '../../functions/isRequiredToUpdate'
import { formatMusic } from '../../functions/formatMusic'

import { reporter } from '../../utils/reporter'
import { chalk } from '../../utils/chalk'

import { DifficultyField, Music } from '../../@types/Music'
import { difficulties } from '../../constants/difficulties'

export const syncScores = async (
  processedMusics: Music[],
  airtableLimiter: <T>(fn: () => Promise<T>) => Promise<T>,
  airtableInstance: AxiosInstance
) => {
  /**
   * Part 1: Scores
   */
  reporter.info('Reading scores from remote')
  const remoteRawScores = await getAllAirtableRecords<Music>(
    'Score',
    airtableLimiter,
    airtableInstance
  )

  const remoteScores = remoteRawScores.map(record =>
    formatAirtableRecord(record, formatMusic)
  )

  reporter.done(`Retrived ${chalk.green(remoteRawScores.length)} scores!`)

  // clean data for removed music (in case of version upgrade)
  // condition met when data in remote present but not in processed data
  const scoresPendingForRemoval = remoteScores
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
  const scoresPendingToAdd = processedMusics
    .map(music => {
      const targetRemoteMusic = locateMusic(
        music.Name,
        music.Version,
        remoteScores.map(o => o.fields)
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
  const scoresPendingToUpdate = remoteScores
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
        if (
          isRequiredToUpdate<string>(
            remoteRecord.fields,
            targetProcessedMusic,
            flatMap(
              difficulties.map(difficulty =>
                ['Progress', 'Level', 'CL', '100%', 'FC', 'AP', 'FDX'].map(
                  option => `${difficulty.code} - ${option}`
                )
              )
            ),
            formatMusic
          )
        ) {
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
    if (scoresPendingForRemoval.length !== 0) {
      reporter.info(
        `Removing ${chalk.blue(
          scoresPendingForRemoval.length
        )} scores from remote`
      )
      const recordChunks = chunk(scoresPendingForRemoval, 10)

      await Promise.all(
        recordChunks.map(async chunk => {
          return await airtableLimiter(() =>
            airtableInstance.delete('/Score', {
              params: {
                records: chunk,
              },
            })
          )
        })
      )
    }

    // update api
    if (scoresPendingToUpdate.length !== 0) {
      reporter.info(
        `Updating ${chalk.blue(scoresPendingToUpdate.length)} scores on remote`
      )
      const recordChunks = chunk(scoresPendingToUpdate, 10)

      await Promise.all(
        recordChunks.map(async chunk => {
          return await airtableLimiter(() =>
            airtableInstance.patch('/Score', {
              records: chunk,
            })
          )
        })
      )
    }

    // create api
    if (scoresPendingToAdd.length !== 0) {
      reporter.info(
        `Adding ${chalk.blue(scoresPendingToAdd.length)} scores to remote`
      )
      const recordChunks = chunk(scoresPendingToAdd, 10)

      await Promise.all(
        recordChunks.map(async chunk => {
          return await airtableLimiter(() =>
            airtableInstance.post('/Score', {
              records: chunk,
            })
          )
        })
      )
    }

    if (
      scoresPendingForRemoval.length === 0 &&
      scoresPendingToAdd.length === 0 &&
      scoresPendingToUpdate.length === 0
    ) {
      reporter.info('Score already up-to-date!')
    }
  } catch (e) {
    throw e
  }
}
