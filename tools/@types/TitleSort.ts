import { ArrayString } from './ArrayString'

export interface TitleSort {
  SerializeSortData: {
    SortList: [
      {
        StringID: {
          id: ArrayString
          str: ArrayString
        }[]
      }
    ]
  }
}
