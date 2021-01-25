import { AxiosInstance } from 'axios'
import { flatMap } from 'lodash'

import { ListResponse } from '../@types/AirtableListResponse'
import { AirtableRecord } from '../@types/AirtableRecord'

export const getAllAirtableRecords = async <P>(
  tableName: string,
  limiter: <T>(fn: () => Promise<T>) => Promise<T>,
  airtableInstance: AxiosInstance
) => {
  let queue: AirtableRecord<Partial<P>>[][] = []
  let offset: string | undefined = undefined

  while (true) {
    const response = await limiter(() =>
      airtableInstance.get<ListResponse<Partial<P>>>(`/${tableName}`, {
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
