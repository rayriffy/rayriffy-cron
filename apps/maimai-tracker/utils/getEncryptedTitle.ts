import fs from 'fs'
import path from 'path'

import { decrypt } from '../../../core/services/crypto/decrypt'

import { EncryptedData } from '../../../core/@types/EncryptedData'
import { BuiltTitle } from '../@types/BuiltTitle'

export const getEncryptedTitle = (): BuiltTitle[] => {
  const encryptedData: EncryptedData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../out/title.json')).toString()
  )

  return JSON.parse(decrypt(encryptedData))
}
