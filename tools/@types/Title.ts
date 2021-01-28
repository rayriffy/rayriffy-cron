import { ArrayString } from './ArrayString'
import { ArrayStringBoolean } from './ArrayStringBoolean'
import { ArrayStringNumber } from './ArrayStringNumber'

export interface Title {
  TitleData: {
    dataName: ArrayString
    netOpenName: [
      {
        id: ArrayStringNumber
        str: ArrayString
      }
    ]
    releaseTagName: [
      {
        id: ArrayStringNumber
        str: ArrayString // Ver1.10.0
      }
    ]
    disable: ArrayStringBoolean
    eventName: [
      {
        id: ArrayStringNumber
        str: ArrayString
      }
    ]
    name: [
      {
        id: ArrayStringNumber
        str: ArrayString
      }
    ]
    genre: [
      {
        id: ArrayStringNumber
        str: ArrayString
      }
    ]
    isDefault: ArrayStringBoolean
    normText: ArrayString
    dispCond: ArrayString
    rareType: ArrayString
    // relConds: [ [Object] ], // i not use this leave someone else to do latr
    isNew: ArrayStringBoolean
    isHave: ArrayStringBoolean
    isFavourite: ArrayStringBoolean
    priority: ArrayStringNumber
  }
}
