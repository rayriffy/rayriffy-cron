export type GameVersion = "maimai" | "maimai PLUS" | "GreeN" | "GreeN PLUS" | "ORANGE" | "ORANGE PLUS" | "PiNK" | "PiNK PLUS" | "MURASAKi" | "MURASAKi PLUS" | "MiLK" | "MiLK PLUS" | "FiNALE" | "maimaiでらっくす" | "maimaiでらっくす PLUS"

export type GameGenre = "POPS & ANIME" | "niconico ＆ VOCALOID™" | "東方Project" | "GAME＆VARIETY" | "maimai" | "オンゲキ＆CHUNITHM"

export interface Music {
  Name: string
  Version: GameVersion
  Genre: GameGenre

  // Easy
  'EAS - CL': boolean
  'EAS - 100%': boolean
  'EAS - FC': boolean
  'EAS - AP': boolean
  'EAS - FDX': boolean

  // Advanced
  'ADV - CL': boolean
  'ADV - 100%': boolean
  'ADV - FC': boolean
  'ADV - AP': boolean
  'ADV - FDX': boolean

  // Expert
  'EXP - CL': boolean
  'EXP - FC': boolean
  'EXP - 100%': boolean
  'EXP - AP': boolean
  'EXP - FDX': boolean

  // Master
  'MAS - CL': boolean
  'MAS - FC': boolean
  'MAS - 100%': boolean
  'MAS - AP': boolean
  'MAS - FDX': boolean

  // Remaster
  isRemaster: boolean
  'REM - CL': boolean
  'REM - FC': boolean
  'REM - 100%': boolean
  'REM - AP': boolean
  'REM - FDX': boolean
}