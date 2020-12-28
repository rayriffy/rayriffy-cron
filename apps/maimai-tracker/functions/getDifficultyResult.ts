import fromEntries from 'object.fromentries'

import { Difficulty } from '../constants/difficulties'
import { Score } from '../core/getScoresFromAllDifficulties'

export const getDifficultyResult = (
  scores: Score[],
  targetDifficulty: Difficulty['code']
) => {
  const targetScore = scores.find(
    score => score.difficulty === targetDifficulty
  )

  const formatObject = (score: Score) => {
    if (score.playData === null) {
      return fromEntries([
        [`${targetDifficulty} - CL`, false],
        [`${targetDifficulty} - 100%`, false],
        [`${targetDifficulty} - FC`, false],
        [`${targetDifficulty} - AP`, false],
        [`${targetDifficulty} - FDX`, false],
      ])
    } else {
      return fromEntries([
        [`${targetDifficulty} - CL`, true],
        [`${targetDifficulty} - 100%`, score.playData.sss],
        [`${targetDifficulty} - FC`, score.playData.fc],
        [`${targetDifficulty} - AP`, score.playData.ap],
        [`${targetDifficulty} - FDX`, score.playData.fdx],
      ])
    }
  }

  // if not found, then it is not remaster
  if (targetScore === undefined) {
    return {
      isRemaster: false,
    }
  } else {
    if (targetDifficulty === 'REM') {
      return {
        isRemaster: true,
        ...formatObject(targetScore),
      }
    } else {
      return formatObject(targetScore)
    }
  }
}
