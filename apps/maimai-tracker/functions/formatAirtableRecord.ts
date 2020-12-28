import { AirtableRecord } from '../@types/AirtableRecord'
import { Music } from '../@types/Music'

export const formatAirtableRecord = (
  record: AirtableRecord<Partial<Music>>
): AirtableRecord<Music> => {
  const defaultMusic: Music = {
    Name: '',
    Version: 'maimai',
    Genre: 'niconico ＆ VOCALOID™',

    // Easy
    'EAS - CL': false,
    'EAS - 100%': false,
    'EAS - FC': false,
    'EAS - AP': false,
    'EAS - FDX': false,

    // Advanced
    'ADV - CL': false,
    'ADV - 100%': false,
    'ADV - FC': false,
    'ADV - AP': false,
    'ADV - FDX': false,

    // Expert
    'EXP - CL': false,
    'EXP - FC': false,
    'EXP - 100%': false,
    'EXP - AP': false,
    'EXP - FDX': false,

    // Master
    'MAS - CL': false,
    'MAS - FC': false,
    'MAS - 100%': false,
    'MAS - AP': false,
    'MAS - FDX': false,

    // Remaster
    isRemaster: false,
    'REM - CL': false,
    'REM - FC': false,
    'REM - 100%': false,
    'REM - AP': false,
    'REM - FDX': false,
  }

  return {
    ...record,
    fields: {
      ...defaultMusic,
      ...record.fields,
    },
  }
}
