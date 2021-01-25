export type GameVersion =
  | 'maimai'
  | 'maimai PLUS'
  | 'GreeN'
  | 'GreeN PLUS'
  | 'ORANGE'
  | 'ORANGE PLUS'
  | 'PiNK'
  | 'PiNK PLUS'
  | 'MURASAKi'
  | 'MURASAKi PLUS'
  | 'MiLK'
  | 'MiLK PLUS'
  | 'FiNALE'
  | 'maimaiでらっくす'
  | 'maimaiでらっくす PLUS'

export type Level =
  | '1'
  | '1+'
  | '2'
  | '2+'
  | '3'
  | '3+'
  | '4'
  | '4+'
  | '5'
  | '5+'
  | '6'
  | '6+'
  | '7'
  | '7+'
  | '8'
  | '8+'
  | '9'
  | '9+'
  | '10'
  | '10+'
  | '11'
  | '11+'
  | '12'
  | '12+'
  | '13'
  | '13+'
  | '14'
  | '14+'
  | '15'
  | '15+'

export type GameGenre =
  | 'POPS & ANIME'
  | 'niconico ＆ VOCALOID™'
  | '東方Project'
  | 'GAME＆VARIETY'
  | 'maimai'
  | 'オンゲキ＆CHUNITHM'

export type DifficultyField =
  | 'Progress'
  | 'Level'
  | 'CL'
  | '100%'
  | 'FC'
  | 'AP'
  | 'FDX'

export interface Music {
  Name: string
  Version: GameVersion
  Genre: GameGenre

  // Easy
  'EAS - Progress'?: number
  'EAS - Level': Level
  'EAS - CL': boolean
  'EAS - 100%': boolean
  'EAS - FC': boolean
  'EAS - AP': boolean
  'EAS - FDX': boolean

  // Advanced
  'ADV - Progress'?: number
  'ADV - Level': Level
  'ADV - CL': boolean
  'ADV - 100%': boolean
  'ADV - FC': boolean
  'ADV - AP': boolean
  'ADV - FDX': boolean

  // Expert
  'EXP - Progress'?: number
  'EXP - Level': Level
  'EXP - CL': boolean
  'EXP - FC': boolean
  'EXP - 100%': boolean
  'EXP - AP': boolean
  'EXP - FDX': boolean

  // Master
  'MAS - Progress'?: number
  'MAS - Level': Level
  'MAS - CL': boolean
  'MAS - FC': boolean
  'MAS - 100%': boolean
  'MAS - AP': boolean
  'MAS - FDX': boolean

  // Remaster
  isRemaster: boolean
  'REM - Progress'?: number
  'REM - Level': Level
  'REM - CL': boolean
  'REM - FC': boolean
  'REM - 100%': boolean
  'REM - AP': boolean
  'REM - FDX': boolean
}
