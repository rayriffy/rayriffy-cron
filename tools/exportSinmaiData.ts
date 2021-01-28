import fs from 'fs'
import path from 'path'

import xml2js from 'xml2js'

import { TitleSort } from './@types/TitleSort'
import { Title } from './@types/Title'
import { BuiltTitle } from '../apps/maimai-tracker/@types/BuiltTitle'
import { encrypt } from '../core/services/crypto/encrypt'

const sinmaiDataPath = path.resolve(
  '/Volumes/Heavy Duty/Arcade/maimai/Splash/App/Package/Sinmai_Data'
)
const streamingAssetsPath = path.join(sinmaiDataPath, 'StreamingAssets')
const a0000Path = path.join(streamingAssetsPath, 'A000')

const outputDump = path.join(__dirname, '../apps/maimai-tracker/out')

const parser = new xml2js.Parser({})

;(async () => {
  // extract title
  const titlePath = path.join(a0000Path, 'title')

  // read file
  const titleSort: TitleSort = await parser.parseStringPromise(
    fs.readFileSync(path.join(titlePath, 'TitleSort.xml')).toString()
  )
  const transformedTitleSort: BuiltTitle[] = await Promise.all(
    titleSort.SerializeSortData.SortList[0].StringID.map(async item => {
      const title: Title = await parser.parseStringPromise(
        fs
          .readFileSync(
            path.join(
              titlePath,
              `title${item.id[0].padStart(6, '0')}`,
              'Title.xml'
            )
          )
          .toString()
      )

      return {
        name: item.str[0],
        condition: title.TitleData.normText[0],
        type: title.TitleData.rareType[0] as BuiltTitle['type'],
      }
    })
  )

  fs.writeFileSync(
    path.join(outputDump, 'title.json'),
    JSON.stringify(encrypt(JSON.stringify(transformedTitleSort)))
  )
})()
