import { flatMapDeep, groupBy } from 'lodash'
import chalk from 'chalk'

import { getDifficultyResult } from '../functions/getDifficultyResult'
import { getSongGenre } from '../functions/getSongGenre'

import { Score } from './getScoresFromAllDifficulties'
import { SongWithGenre } from './getSongsWithGenre'

import { Music } from '../@types/Music'
import { reporter } from '../utils/reporter'

export const remoteScoresToAirtableFormat = (
  scoresFromAllDifficulties: Score[],
  songsWithGenre: SongWithGenre[]
): Music[] => {
  reporter.info('Processing data...')

  const grouppedScoreByName = groupBy(
    scoresFromAllDifficulties,
    item => item.song
  )
  const processedData: Music[] = flatMapDeep(
    Object.entries(grouppedScoreByName).map(([key, scores]) => {
      // to seperate standard chart from deluxe chart
      const grouupedScoreByVersion = groupBy(scores, item => item.version)

      return Object.entries(grouupedScoreByVersion).map(([key, scores]) => {
        const songName = scores[0].song
        const songVersion = scores[0].version
        const songGenre = getSongGenre(songName, songsWithGenre)

        return {
          Name: songName,
          Version: songVersion,
          Genre: songGenre,
          ...getDifficultyResult(scores, 'EAS'),
          ...getDifficultyResult(scores, 'ADV'),
          ...getDifficultyResult(scores, 'EXP'),
          ...getDifficultyResult(scores, 'MAS'),
          ...getDifficultyResult(scores, 'REM'),
        } as Music
      })
    })
  )

  reporter.done(
    `Processed! Data has been groupped into ${chalk.green(
      processedData.length
    )} records`
  )

  return processedData
}
