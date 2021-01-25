import { AirtableRecord } from '../@types/AirtableRecord'

export const formatAirtableRecord = <T = unknown>(
  record: AirtableRecord<Partial<T>>,
  normalizeFunction: (input: Partial<T>) => T
): AirtableRecord<T> => {
  const result = {
    ...record,
    fields: normalizeFunction(record.fields),
  }

  return result
}
