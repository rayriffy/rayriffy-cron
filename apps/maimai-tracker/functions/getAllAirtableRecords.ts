import { AxiosInstance } from 'axios'
import { flatMap } from 'lodash'

import { AirtableRecord } from '../@types/AirtableRecord'
import { Music } from '../@types/Music'

interface ListResponse {
  records: AirtableRecord<Partial<Music>>[]
  offset?: string
}

export const getAllAirtableRecords = async (
  limiter: <T>(fn: () => Promise<T>) => Promise<T>,
  airtableInstance: AxiosInstance
) => {
  let queue: AirtableRecord<Partial<Music>>[][] = []
  let offset: string | undefined = undefined

  while (true) {
    const response = await limiter(() =>
      airtableInstance.get<ListResponse>('/', {
        params:
          offset === undefined
            ? undefined
            : {
                offset,
              },
      })
    )
    queue.push(response.data.records)

    // get out of infinite loop when hit the end of offset
    if (response.data.offset === undefined) {
      break
    } else {
      offset = response.data.offset
    }
  }

  return flatMap(queue)
}
