import moment from 'moment'

import { PlayerData } from '../@types/PlayerData'

export const formatPlayerData = (input: Partial<PlayerData>): PlayerData => {
  const defaultPlayerData: PlayerData = {
    Timestamp: moment().format('YYYY-MM-DD'),
    'Deluxe rating': 0,
    'Total tracks': 0,
    'SSS+': 0,
    SSS: 0,
    'SS+': 0,
    SS: 0,
    'S+': 0,
    S: 0,
    Clear: 0,
    '5 DX star': 0,
    '4 DX star': 0,
    '3 DX star': 0,
    '2 DX star': 0,
    '1 DX star': 0,
    'AP+': 0,
    AP: 0,
    'FC+': 0,
    FC: 0,
    'FDX+': 0,
    FDX: 0,
    'FS+': 0,
    FS: 0,
  }

  return {
    ...defaultPlayerData,
    ...input,
  }
}
