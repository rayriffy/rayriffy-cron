import { formatMusic } from './formatMusic'

import { AirtableRecord } from '../@types/AirtableRecord'
import { Music } from '../@types/Music'

export const formatAirtableRecord = (
  record: AirtableRecord<Partial<Music>>
): AirtableRecord<Music> => {
  const result = {
    ...record,
    fields: formatMusic(record.fields),
  }

  return result
}
