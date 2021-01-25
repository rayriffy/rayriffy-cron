import { AirtableBaseData } from '../@types/AirtableBaseData'

const { AIRTABLE_BASE_DATA } = process.env

export const getAirtableBaseId = (id: keyof AirtableBaseData): string =>
  JSON.parse(AIRTABLE_BASE_DATA || '{}')[id]
