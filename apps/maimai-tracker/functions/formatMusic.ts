import { Music } from '../@types/Music'

export const formatMusic = (input: Partial<Music>): Music => {
  const defaultMusic: Music = {
    Name: '',
    Version: 'maimai',
    Genre: 'niconico ＆ VOCALOID™',

    // Easy
    'EAS - CL': false,
    'EAS - Level': '1',
    'EAS - 100%': false,
    'EAS - FC': false,
    'EAS - AP': false,
    'EAS - FDX': false,

    // Advanced
    'ADV - CL': false,
    'ADV - Level': '1',
    'ADV - 100%': false,
    'ADV - FC': false,
    'ADV - AP': false,
    'ADV - FDX': false,

    // Expert
    'EXP - CL': false,
    'EXP - Level': '1',
    'EXP - FC': false,
    'EXP - 100%': false,
    'EXP - AP': false,
    'EXP - FDX': false,

    // Master
    'MAS - CL': false,
    'MAS - Level': '1',
    'MAS - FC': false,
    'MAS - 100%': false,
    'MAS - AP': false,
    'MAS - FDX': false,

    // Remaster
    isRemaster: false,
    'REM - CL': false,
    'REM - Level': '1',
    'REM - FC': false,
    'REM - 100%': false,
    'REM - AP': false,
    'REM - FDX': false,
  }

  return {
    ...defaultMusic,
    ...input,
  }
}
