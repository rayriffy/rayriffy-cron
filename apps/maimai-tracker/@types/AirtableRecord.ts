export interface AirtableRecord<T> {
  id: string
  fields: T
  createdTime: string
}
