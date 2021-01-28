import crypto from 'crypto'

import { EncryptedData } from '../../@types/EncryptedData'

const { RAYRIFFY_CRON_SECRET } = process.env

export const encrypt = (input: string): EncryptedData => {
  const encryptionKey = Buffer.from(RAYRIFFY_CRON_SECRET || '')

  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv)

  let enc = cipher.update(input, 'utf8', 'base64')
  enc += cipher.final('base64')

  return {
    iv: iv.toString('base64'),
    data: enc,
  }
}
