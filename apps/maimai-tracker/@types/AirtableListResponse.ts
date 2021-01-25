import { AirtableRecord } from './AirtableRecord'

export interface ListResponse<T> {
  records: AirtableRecord<T>[]
  offset?: string
}
